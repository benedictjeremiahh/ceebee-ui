import 'dart:async';
import 'dart:io';

import 'package:flutter/services.dart';

Future<void> testExecutable(FutureOr<void> Function() testMain) async {
  final Directory flutterCache = findFlutterCache();
  final FontLoader roboto = FontLoader('Roboto')
    ..addFont(fontData(flutterCache, 'Roboto-Regular.ttf'))
    ..addFont(fontData(flutterCache, 'Roboto-Medium.ttf'));
  final FontLoader materialIcons = FontLoader('MaterialIcons')
    ..addFont(fontData(flutterCache, 'MaterialIcons-Regular.otf'));
  await Future.wait(<Future<void>>[roboto.load(), materialIcons.load()]);
  await testMain();
}

Directory findFlutterCache() {
  Directory candidate = File(Platform.resolvedExecutable).parent;
  while (candidate.parent.path != candidate.path) {
    if (File(
      '${candidate.path}/artifacts/material_fonts/Roboto-Regular.ttf',
    ).existsSync()) {
      return candidate;
    }
    candidate = candidate.parent;
  }
  throw StateError(
    'Could not locate Flutter material fonts from the test executable.',
  );
}

Future<ByteData> fontData(Directory flutterCache, String fileName) async {
  final File file = File.fromUri(
    flutterCache.uri.resolve('artifacts/material_fonts/$fileName'),
  );
  final Uint8List bytes = await file.readAsBytes();
  return ByteData.sublistView(bytes);
}
