import { useCallback, useEffect, useRef, useState } from 'react';
import adminApi from '../adminApi';
import Icon from '@/components/ui/Icon';
import Button from '@/components/ui/Button';
import { EmptyState, LoadingBlock } from '@/components/ui/States';
import { Card, ConfirmDialog, PageHeader, SearchInput, Toast, Toolbar, useToast } from '../components/AdminUi';

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

export default function AdminMedia() {
  const toast = useToast();
  const inputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [state, setState] = useState({ loading: true, error: null });
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [copied, setCopied] = useState(null);

  const load = useCallback(async () => {
    setState({ loading: true, error: null });
    try {
      const res = await adminApi.media(search.trim() ? { search: search.trim() } : {});
      setItems(res.data || []);
      setState({ loading: false, error: null });
    } catch (error) {
      setState({ loading: false, error });
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  const upload = async (files) => {
    setUploading(true);
    let failures = 0;
    for (const file of Array.from(files)) {
      try {
        await adminApi.uploadMedia(file);
      } catch (error) {
        failures += 1;
        toast.error(`${file.name}: ${error.message}`);
      }
    }
    setUploading(false);
    if (failures === 0) toast.success('Uploaded.');
    load();
  };

  const copy = async (item) => {
    try {
      await navigator.clipboard.writeText(item.url);
      setCopied(item.id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error('Could not copy — select the URL manually.');
    }
  };

  const remove = async () => {
    try {
      await adminApi.deleteMedia(deleting.id);
      setItems((list) => list.filter((i) => i.id !== deleting.id));
      toast.success('Deleted.');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <PageHeader title="Media library" description="Images and documents used across the site.">
        <Button as="button" onClick={() => inputRef.current?.click()} icon="Plus" size="sm" loading={uploading}>
          Upload
        </Button>
      </PageHeader>

      <input ref={inputRef} type="file" multiple className="sr-only"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt"
        onChange={(e) => { upload(e.target.files); e.target.value = ''; }} />

      <Toolbar>
        <SearchInput value={search} onChange={setSearch} placeholder="Search files…" />
        <span className="text-[0.8rem] text-faint">{items.length} files</span>
      </Toolbar>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); upload(e.dataTransfer.files); }}
      >
        <Card padded={false}>
          {state.loading ? (
            <LoadingBlock />
          ) : state.error ? (
            <EmptyState icon="AlertCircle" title="Could not load" description={state.error.message} />
          ) : items.length === 0 ? (
            <EmptyState icon="Copy" title="Nothing uploaded yet"
              description="Drop files here, or use the upload button."
              action={<Button as="button" onClick={() => inputRef.current?.click()} icon="Plus">Upload</Button>} />
          ) : (
            <ul className="grid gap-4 p-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {items.map((item) => (
                <li key={item.id} className="group overflow-hidden rounded-xl border bg-surface">
                  <div className="relative aspect-[4/3] bg-elevated">
                    {item.mimeType?.startsWith('image/') ? (
                      <img src={item.url} alt={item.alt || item.name} loading="lazy"
                        className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-faint">
                        <Icon name="FileText" className="h-7 w-7" />
                      </span>
                    )}
                    <span className="absolute inset-0 flex items-center justify-center gap-2 bg-black/55 opacity-0 transition-opacity group-hover:opacity-100">
                      <button type="button" onClick={() => copy(item)}
                        className="rounded-lg bg-white/15 px-2.5 py-1.5 text-[0.72rem] font-semibold text-white backdrop-blur">
                        {copied === item.id ? 'Copied' : 'Copy URL'}
                      </button>
                      <button type="button" onClick={() => setDeleting(item)} aria-label={`Delete ${item.name}`}
                        className="rounded-lg bg-white/15 p-1.5 text-white backdrop-blur hover:bg-red-500/70">
                        <Icon name="X" className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-[0.78rem] font-medium text-ink" title={item.name}>{item.name}</p>
                    <p className="text-[0.7rem] text-faint">
                      {formatSize(item.size)}{item.width ? ` · ${item.width}×${item.height}` : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <ConfirmDialog open={Boolean(deleting)} title="Delete this file?"
        body={deleting ? `${deleting.name} will be permanently removed. Anything using it will break.` : ''}
        onConfirm={remove} onCancel={() => setDeleting(null)} />
      <Toast toast={toast.toast} onDismiss={toast.dismiss} />
    </>
  );
}
