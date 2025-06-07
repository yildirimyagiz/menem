import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../models/reservation.dart';
import '../../providers/reservation_provider.dart';
import '../../widgets/commons/empty_state.dart';
import '../../widgets/commons/error_state.dart';
import '../../widgets/commons/loading_state.dart';
import 'reservation_detail_screen.dart';

class ReservationListScreen extends ConsumerStatefulWidget {
  const ReservationListScreen({super.key});

  @override
  ConsumerState<ReservationListScreen> createState() =>
      _ReservationListScreenState();
}

class _ReservationListScreenState extends ConsumerState<ReservationListScreen> {
  ReservationType? _selectedType;
  ReservationStatus? _selectedStatus;
  bool _showActiveOnly = false;

  @override
  void initState() {
    super.initState();
    Future.microtask(() {
      ref.read(reservationsNotifierProvider.notifier).refresh();
    });
  }

  @override
  Widget build(BuildContext context) {
    final reservationsAsync = ref.watch(reservationsNotifierProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Reservations'),
        actions: [
          IconButton(
            icon: const Icon(Icons.filter_list),
            onPressed: _showFilterDialog,
          ),
        ],
      ),
      body: Column(
        children: [
          if (_selectedType != null ||
              _selectedStatus != null ||
              _showActiveOnly)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Wrap(
                spacing: 8,
                children: [
                  if (_selectedType != null)
                    Chip(
                      label: Text(_getReservationTypeLabel(_selectedType!)),
                      onDeleted: () {
                        setState(() {
                          _selectedType = null;
                        });
                      },
                    ),
                  if (_selectedStatus != null)
                    Chip(
                      label: Text(_getReservationStatusLabel(_selectedStatus!)),
                      onDeleted: () {
                        setState(() {
                          _selectedStatus = null;
                        });
                      },
                    ),
                  if (_showActiveOnly)
                    Chip(
                      label: const Text('Active Only'),
                      onDeleted: () {
                        setState(() {
                          _showActiveOnly = false;
                        });
                      },
                    ),
                ],
              ),
            ),
          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                await ref.read(reservationsNotifierProvider.notifier).refresh();
              },
              child: reservationsAsync.when(
                data: (reservations) {
                  final filteredReservations =
                      _filterReservations(reservations);
                  if (filteredReservations.isEmpty) {
                    return const EmptyState(
                      message: 'No reservations found',
                      icon: Icons.calendar_today,
                    );
                  }

                  return ListView.builder(
                    itemCount: filteredReservations.length,
                    itemBuilder: (context, index) {
                      final reservation = filteredReservations[index];
                      return ListTile(
                        leading: CircleAvatar(
                          backgroundColor: _getStatusColor(reservation.status),
                          child: Icon(
                            _getReservationTypeIcon(reservation.type),
                            color: Colors.white,
                          ),
                        ),
                        title:
                            Text(reservation.type.toString().split('.').last),
                        subtitle: Text(
                          '${_formatDate(reservation.startTime)} - ${_formatDate(reservation.endTime)}',
                        ),
                        trailing: Chip(
                          label: Text(
                            reservation.status.toString().split('.').last,
                            style: TextStyle(
                              color: _getStatusColor(reservation.status),
                            ),
                          ),
                        ),
                        onTap: () {
                          Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (context) => ReservationDetailScreen(
                                reservation: reservation,
                              ),
                            ),
                          );
                        },
                      );
                    },
                  );
                },
                loading: () => const LoadingState(),
                error: (error, stackTrace) => ErrorState(
                  message: error.toString(),
                  onRetry: () {
                    ref.read(reservationsNotifierProvider.notifier).refresh();
                  },
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  List<Reservation> _filterReservations(List<Reservation> reservations) {
    return reservations.where((reservation) {
      if (_selectedType != null && reservation.type != _selectedType) {
        return false;
      }
      if (_selectedStatus != null && reservation.status != _selectedStatus) {
        return false;
      }
      if (_showActiveOnly && !reservation.isActive) {
        return false;
      }
      return true;
    }).toList();
  }

  void _showFilterDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Filter Reservations'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            DropdownButtonFormField<ReservationType?>(
              value: _selectedType,
              decoration: const InputDecoration(
                labelText: 'Reservation Type',
              ),
              items: [
                const DropdownMenuItem(
                  value: null,
                  child: Text('All Types'),
                ),
                ...ReservationType.values.map(
                  (type) => DropdownMenuItem(
                    value: type,
                    child: Text(_getReservationTypeLabel(type)),
                  ),
                ),
              ],
              onChanged: (value) {
                setState(() {
                  _selectedType = value;
                });
                Navigator.of(context).pop();
              },
            ),
            const SizedBox(height: 16),
            DropdownButtonFormField<ReservationStatus?>(
              value: _selectedStatus,
              decoration: const InputDecoration(
                labelText: 'Status',
              ),
              items: [
                const DropdownMenuItem(
                  value: null,
                  child: Text('All Statuses'),
                ),
                ...ReservationStatus.values.map(
                  (status) => DropdownMenuItem(
                    value: status,
                    child: Text(_getReservationStatusLabel(status)),
                  ),
                ),
              ],
              onChanged: (value) {
                setState(() {
                  _selectedStatus = value;
                });
                Navigator.of(context).pop();
              },
            ),
            const SizedBox(height: 16),
            SwitchListTile(
              title: const Text('Active Only'),
              value: _showActiveOnly,
              onChanged: (value) {
                setState(() {
                  _showActiveOnly = value;
                });
                Navigator.of(context).pop();
              },
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () {
              setState(() {
                _selectedType = null;
                _selectedStatus = null;
                _showActiveOnly = false;
              });
              Navigator.of(context).pop();
            },
            child: const Text('Clear Filters'),
          ),
          TextButton(
            onPressed: () {
              Navigator.of(context).pop();
            },
            child: const Text('Close'),
          ),
        ],
      ),
    );
  }

  String _getReservationTypeLabel(ReservationType type) {
    switch (type) {
      case ReservationType.booking:
        return 'Booking';
      case ReservationType.viewing:
        return 'Viewing';
      case ReservationType.maintenance:
        return 'Maintenance';
      case ReservationType.other:
        return 'Other';
    }
  }

  String _getReservationStatusLabel(ReservationStatus status) {
    switch (status) {
      case ReservationStatus.pending:
        return 'Pending';
      case ReservationStatus.confirmed:
        return 'Confirmed';
      case ReservationStatus.cancelled:
        return 'Cancelled';
      case ReservationStatus.completed:
        return 'Completed';
      case ReservationStatus.noShow:
        return 'No Show';
      case ReservationStatus.CANCELLED:
        // TODO: Handle this case.
        throw UnimplementedError();
    }
  }

  IconData _getReservationTypeIcon(ReservationType type) {
    switch (type) {
      case ReservationType.booking:
        return Icons.calendar_today;
      case ReservationType.viewing:
        return Icons.visibility;
      case ReservationType.maintenance:
        return Icons.build;
      case ReservationType.other:
        return Icons.more_horiz;
    }
  }

  Color _getStatusColor(ReservationStatus status) {
    switch (status) {
      case ReservationStatus.pending:
        return Colors.orange;
      case ReservationStatus.confirmed:
        return Colors.green;
      case ReservationStatus.cancelled:
        return Colors.red;
      case ReservationStatus.completed:
        return Colors.blue;
      case ReservationStatus.noShow:
        return Colors.grey;
      case ReservationStatus.CANCELLED:
        // TODO: Handle this case.
        throw UnimplementedError();
    }
  }

  String _formatDate(DateTime date) {
    return '${date.day}/${date.month}/${date.year}';
  }
}
