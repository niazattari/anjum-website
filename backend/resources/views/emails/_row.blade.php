@if(filled($value))
    <tr>
        <td style="padding:7px 0;color:#64748b;font-size:13px;width:180px;vertical-align:top;">{{ $label }}</td>
        <td style="padding:7px 0;color:#0b1220;font-size:14px;">{!! nl2br(e(is_array($value) ? implode(', ', $value) : $value)) !!}</td>
    </tr>
@endif
