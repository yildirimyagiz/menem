import 'package:flutter/material.dart';
import 'package:mobile/generated/l10n.dart';
import '../../models/availability.dart';
import 'package:intl/intl.dart';

class AvailabilityEditScreen extends StatefulWidget {
  final Availability availability;
  const AvailabilityEditScreen({super.key, required this.availability});

  @override
  State<AvailabilityEditScreen> createState() => _AvailabilityEditScreenState();
}

class _AvailabilityEditScreenState extends State<AvailabilityEditScreen> {
  late TextEditingController _propertyIdController;
  late TextEditingController _reservationIdController;
  late TextEditingController _pricingRuleIdController;
  late TextEditingController _totalUnitsController;
  late TextEditingController _availableUnitsController;
  late TextEditingController _bookedUnitsController;
  late TextEditingController _blockedUnitsController;
  late TextEditingController _basePriceController;
  late TextEditingController _currentPriceController;
  late TextEditingController _specialPricingController;
  late TextEditingController _priceSettingsController;
  late TextEditingController _minNightsController;
  late TextEditingController _maxNightsController;
  late TextEditingController _maxGuestsController;
  late TextEditingController _discountSettingsController;
  late TextEditingController _weekendRateController;
  late TextEditingController _weekdayRateController;
  late TextEditingController _weekendMultiplierController;
  late TextEditingController _weekdayMultiplierController;
  late TextEditingController _seasonalMultiplierController;
  DateTime? _date;
  bool _isBlocked = false;
  bool _isBooked = false;

  @override
  void initState() {
    super.initState();
    final a = widget.availability;
    _date = a.date;
    _isBlocked = a.isBlocked;
    _isBooked = a.isBooked;
    _propertyIdController = TextEditingController(text: a.propertyId);
    _reservationIdController =
        TextEditingController(text: a.reservationId ?? '');
    _pricingRuleIdController =
        TextEditingController(text: a.pricingRuleId ?? '');
    _totalUnitsController =
        TextEditingController(text: a.totalUnits.toString());
    _availableUnitsController =
        TextEditingController(text: a.availableUnits.toString());
    _bookedUnitsController =
        TextEditingController(text: a.bookedUnits.toString());
    _blockedUnitsController =
        TextEditingController(text: a.blockedUnits.toString());
    _basePriceController = TextEditingController(text: a.basePrice.toString());
    _currentPriceController =
        TextEditingController(text: a.currentPrice.toString());
    _specialPricingController =
        TextEditingController(text: a.specialPricing?.toString() ?? '');
    _priceSettingsController =
        TextEditingController(text: a.priceSettings?.toString() ?? '');
    _minNightsController =
        TextEditingController(text: a.minNights?.toString() ?? '');
    _maxNightsController =
        TextEditingController(text: a.maxNights?.toString() ?? '');
    _maxGuestsController = TextEditingController(text: a.maxGuests.toString());
    _discountSettingsController =
        TextEditingController(text: a.discountSettings?.toString() ?? '');
    _weekendRateController =
        TextEditingController(text: a.weekendRate?.toString() ?? '');
    _weekdayRateController =
        TextEditingController(text: a.weekdayRate?.toString() ?? '');
    _weekendMultiplierController =
        TextEditingController(text: a.weekendMultiplier?.toString() ?? '');
    _weekdayMultiplierController =
        TextEditingController(text: a.weekdayMultiplier?.toString() ?? '');
    _seasonalMultiplierController =
        TextEditingController(text: a.seasonalMultiplier?.toString() ?? '');
  }

  @override
  void dispose() {
    _propertyIdController.dispose();
    _reservationIdController.dispose();
    _pricingRuleIdController.dispose();
    _totalUnitsController.dispose();
    _availableUnitsController.dispose();
    _bookedUnitsController.dispose();
    _blockedUnitsController.dispose();
    _basePriceController.dispose();
    _currentPriceController.dispose();
    _specialPricingController.dispose();
    _priceSettingsController.dispose();
    _minNightsController.dispose();
    _maxNightsController.dispose();
    _maxGuestsController.dispose();
    _discountSettingsController.dispose();
    _weekendRateController.dispose();
    _weekdayRateController.dispose();
    _weekendMultiplierController.dispose();
    _weekdayMultiplierController.dispose();
    _seasonalMultiplierController.dispose();
    super.dispose();
  }

  void _save() {
    final updated = widget.availability.copyWith(
      date: _date,
      isBlocked: _isBlocked,
      isBooked: _isBooked,
      propertyId: _propertyIdController.text.trim(),
      reservationId: _reservationIdController.text.trim().isNotEmpty
          ? _reservationIdController.text.trim()
          : null,
      reservationIdExplicitNull: _reservationIdController.text.trim().isEmpty,
      pricingRuleId: _pricingRuleIdController.text.trim().isNotEmpty
          ? _pricingRuleIdController.text.trim()
          : null,
      pricingRuleIdExplicitNull: _pricingRuleIdController.text.trim().isEmpty,
      totalUnits: int.tryParse(_totalUnitsController.text) ?? 0,
      availableUnits: int.tryParse(_availableUnitsController.text) ?? 0,
      bookedUnits: int.tryParse(_bookedUnitsController.text) ?? 0,
      blockedUnits: int.tryParse(_blockedUnitsController.text) ?? 0,
      basePrice: double.tryParse(_basePriceController.text) ?? 0.0,
      currentPrice: double.tryParse(_currentPriceController.text) ?? 0.0,
      specialPricing: _specialPricingController.text.isNotEmpty
          ? {'data': _specialPricingController.text}
          : null,
      specialPricingExplicitNull: _specialPricingController.text.isEmpty,
      priceSettings: _priceSettingsController.text.isNotEmpty
          ? {'data': _priceSettingsController.text}
          : null,
      priceSettingsExplicitNull: _priceSettingsController.text.isEmpty,
      minNights: int.tryParse(_minNightsController.text),
      minNightsExplicitNull: _minNightsController.text.isEmpty,
      maxNights: int.tryParse(_maxNightsController.text),
      maxNightsExplicitNull: _maxNightsController.text.isEmpty,
      maxGuests: int.tryParse(_maxGuestsController.text) ?? 1,
      discountSettings: _discountSettingsController.text.isNotEmpty
          ? {'data': _discountSettingsController.text}
          : null,
      discountSettingsExplicitNull: _discountSettingsController.text.isEmpty,
      weekendRate: double.tryParse(_weekendRateController.text),
      weekendRateExplicitNull: _weekendRateController.text.isEmpty,
      weekdayRate: double.tryParse(_weekdayRateController.text),
      weekdayRateExplicitNull: _weekdayRateController.text.isEmpty,
      weekendMultiplier: double.tryParse(_weekendMultiplierController.text),
      weekdayMultiplier: double.tryParse(_weekdayMultiplierController.text),
      seasonalMultiplier: double.tryParse(_seasonalMultiplierController.text),
    );
    Navigator.of(context).pop(updated);
  }

  @override
  Widget build(BuildContext context) {
    final s = AppLocalizations.of(context)!;
    return Scaffold(
      appBar: AppBar(
        title: Text(s.availability_edit_title),
        actions: [
          IconButton(
            icon: const Icon(Icons.save),
            onPressed: _save,
            tooltip: s.common_save,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Text('${s.availability_date}: '),
                Text(_date != null
                    ? DateFormat.yMMMd().format(_date!)
                    : s.availability_not_set),
                IconButton(
                  icon: const Icon(Icons.calendar_today),
                  onPressed: () async {
                    final picked = await showDatePicker(
                      context: context,
                      initialDate: _date ?? DateTime.now(),
                      firstDate: DateTime(2000),
                      lastDate: DateTime(2100),
                    );
                    if (picked != null) setState(() => _date = picked);
                  },
                ),
              ],
            ),
            SwitchListTile(
              title: Text(s.availability_blocked),
              value: _isBlocked,
              onChanged: (val) => setState(() => _isBlocked = val),
            ),
            SwitchListTile(
              title: Text(s.availability_booked),
              value: _isBooked,
              onChanged: (val) => setState(() => _isBooked = val),
            ),
            TextField(
              controller: _propertyIdController,
              decoration:
                  InputDecoration(labelText: s.availability_property_id),
            ),
            TextField(
              controller: _reservationIdController,
              decoration:
                  InputDecoration(labelText: s.availability_reservation_id),
            ),
            TextField(
              controller: _pricingRuleIdController,
              decoration:
                  InputDecoration(labelText: s.availability_pricing_rule_id),
            ),
            TextField(
              controller: _totalUnitsController,
              decoration:
                  InputDecoration(labelText: s.availability_total_units),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _availableUnitsController,
              decoration:
                  InputDecoration(labelText: s.availability_available_units),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _bookedUnitsController,
              decoration:
                  InputDecoration(labelText: s.availability_booked_units),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _blockedUnitsController,
              decoration:
                  InputDecoration(labelText: s.availability_blocked_units),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _basePriceController,
              decoration: InputDecoration(labelText: s.availability_base_price),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _currentPriceController,
              decoration:
                  InputDecoration(labelText: s.availability_current_price),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _specialPricingController,
              decoration: InputDecoration(
                  labelText: s.availability_special_pricing_json),
            ),
            TextField(
              controller: _priceSettingsController,
              decoration: InputDecoration(
                  labelText: s.availability_price_settings_json),
            ),
            TextField(
              controller: _minNightsController,
              decoration: InputDecoration(labelText: s.availability_min_nights),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _maxNightsController,
              decoration: InputDecoration(labelText: s.availability_max_nights),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _maxGuestsController,
              decoration: InputDecoration(labelText: s.availability_max_guests),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _discountSettingsController,
              decoration: InputDecoration(
                  labelText: s.availability_discount_settings_json),
            ),
            TextField(
              controller: _weekendRateController,
              decoration:
                  InputDecoration(labelText: s.availability_weekend_rate),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _weekdayRateController,
              decoration:
                  InputDecoration(labelText: s.availability_weekday_rate),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _weekendMultiplierController,
              decoration:
                  InputDecoration(labelText: s.availability_weekend_multiplier),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _weekdayMultiplierController,
              decoration:
                  InputDecoration(labelText: s.availability_weekday_multiplier),
              keyboardType: TextInputType.number,
            ),
            TextField(
              controller: _seasonalMultiplierController,
              decoration: InputDecoration(
                  labelText: s.availability_seasonal_multiplier),
              keyboardType: TextInputType.number,
            ),
          ],
        ),
      ),
    );
  }
}
