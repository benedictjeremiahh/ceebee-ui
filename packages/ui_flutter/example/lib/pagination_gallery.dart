import 'package:ceebee_ui/ceebee_ui.dart';
import 'package:flutter/material.dart';

const Key paginationGalleryKey = Key('pagination-gallery');

class PaginationGallery extends StatefulWidget {
  const PaginationGallery({super.key, this.motion = true});

  final bool motion;

  @override
  State<PaginationGallery> createState() => _PaginationGalleryState();
}

class _PaginationGalleryState extends State<PaginationGallery> {
  static const int _pageCount = 24;
  static const int _pageSize = 10;

  int _currentPage = 12;

  @override
  Widget build(BuildContext context) {
    final int firstItem = (_currentPage - 1) * _pageSize + 1;
    final int lastItem = _currentPage * _pageSize;
    return Column(
      key: paginationGalleryKey,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text(
          'Transaction pages',
          style: Theme.of(context).textTheme.displaySmall,
        ),
        const SizedBox(height: CbStructure.space2),
        Text(
          'Pagination keeps the page controlled by the application and adapts the visible controls to its container.',
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        const SizedBox(height: CbStructure.space5),
        CbSurface(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Text(
                'Transactions $firstItem–$lastItem',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: CbStructure.space1),
              Text(
                'Page $_currentPage of $_pageCount · 240 transactions',
                style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                  color: context.cb.fgMuted.toColor(),
                  fontFeatures: const <FontFeature>[
                    FontFeature.tabularFigures(),
                  ],
                ),
              ),
              const SizedBox(height: CbStructure.space4),
              Divider(color: context.cb.border.toColor()),
              const SizedBox(height: CbStructure.space4),
              CbPagination(
                pageCount: _pageCount,
                currentPage: _currentPage,
                motion: widget.motion,
                semanticLabel: 'Transaction pages',
                semanticPageLabelBuilder: (int page, int pageCount) =>
                    'Page $page of $pageCount',
                onPageChanged: (int page) =>
                    setState(() => _currentPage = page),
              ),
            ],
          ),
        ),
        const SizedBox(height: CbStructure.space4),
        CbSurface(
          variant: CbSurfaceVariant.tinted,
          child: CbPaginationSkeleton(motion: widget.motion),
        ),
      ],
    );
  }
}
