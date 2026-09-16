<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Shared CRUD for the straightforward content types. Subclasses declare the
 * model, its validation rules and which relations to load; anything with child
 * lists overrides afterSave() to sync them.
 */
abstract class BaseCrudController extends Controller
{
    /** @var class-string<Model> */
    protected string $model;

    /** Relations eager-loaded on index and show. */
    protected array $with = [];

    /** Columns matched by the ?search= parameter. */
    protected array $searchable = [];

    /** Default ordering applied when the model has no `ordered` scope. */
    protected string $orderColumn = 'sort_order';

    abstract protected function rules(Request $request, ?Model $record = null): array;

    protected function afterSave(Model $record, Request $request): void
    {
        // no child records by default
    }

    public function index(Request $request): JsonResponse
    {
        $query = $this->model::query()->with($this->with);

        if ($search = $request->string('search')->toString()) {
            $query->where(function ($q) use ($search) {
                foreach ($this->searchable as $column) {
                    $q->orWhere($column, 'like', "%{$search}%");
                }
            });
        }

        $query->orderBy($this->orderColumn)->orderBy('id');

        if ($request->boolean('paginate')) {
            return response()->json($query->paginate($request->integer('per_page', 25)));
        }

        return response()->json(['data' => $query->get()]);
    }

    public function show(int|string $id): JsonResponse
    {
        return response()->json(['data' => $this->find($id)]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate($this->rules($request));

        $record = DB::transaction(function () use ($data, $request) {
            $record = $this->model::create($this->fillable($data));
            $this->afterSave($record, $request);

            return $record;
        });

        return response()->json(['data' => $record->fresh($this->with)], 201);
    }

    public function update(Request $request, int|string $id): JsonResponse
    {
        $record = $this->find($id);
        $data = $request->validate($this->rules($request, $record));

        DB::transaction(function () use ($record, $data, $request) {
            $record->update($this->fillable($data));
            $this->afterSave($record, $request);
        });

        return response()->json(['data' => $record->fresh($this->with)]);
    }

    public function destroy(int|string $id): JsonResponse
    {
        $this->find($id)->delete();

        return response()->json(['success' => true]);
    }

    /** Drag-and-drop ordering: [{id, sort_order}, …]. */
    public function reorder(Request $request): JsonResponse
    {
        $data = $request->validate([
            'items' => ['required', 'array'],
            'items.*.id' => ['required', 'integer'],
            'items.*.sort_order' => ['required', 'integer', 'min:0'],
        ]);

        DB::transaction(function () use ($data) {
            foreach ($data['items'] as $item) {
                $this->model::whereKey($item['id'])->update(['sort_order' => $item['sort_order']]);
            }
        });

        return response()->json(['success' => true]);
    }

    protected function find(int|string $id): Model
    {
        return $this->model::with($this->with)->findOrFail($id);
    }

    /** Strips keys that are handled as child records rather than columns. */
    protected function fillable(array $data): array
    {
        return collect($data)->except($this->childKeys())->all();
    }

    protected function childKeys(): array
    {
        return [];
    }
}
