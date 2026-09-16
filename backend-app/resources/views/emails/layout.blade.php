<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Notification')</title>
</head>
<body style="margin:0;padding:24px;background:#f1f5f9;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0b1220;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;">
        <tr>
            <td style="background:linear-gradient(100deg,#2563eb,#0891b2);border-radius:14px 14px 0 0;padding:22px 26px;">
                <span style="color:#fff;font-size:17px;font-weight:700;letter-spacing:-0.02em;">
                    {{ \App\Models\WebsiteSetting::get('site_name', 'Studio') }}
                </span>
            </td>
        </tr>
        <tr>
            <td style="background:#ffffff;padding:28px 26px;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 14px 14px;">
                @yield('content')
            </td>
        </tr>
        <tr>
            <td style="padding:16px 26px;color:#64748b;font-size:12px;line-height:1.6;">
                Sent automatically from your website.
            </td>
        </tr>
    </table>
</body>
</html>
