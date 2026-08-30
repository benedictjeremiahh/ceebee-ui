import 'dart:js_interop';

@JS('open')
external JSAny? _open(JSString url, JSString target);

bool openExternalLink(String url) {
  _open(url.toJS, '_blank'.toJS);
  return true;
}
