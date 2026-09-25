# PharmAlert - Flutter & Firebase Conversion

This is the complete Flutter and Firebase implementation of **PharmAlert: Rule-Based Inventory Alert System for SME Pharmacies in Sri Lanka anticipating dengue demand surges**.

## 🚀 Architecture Overview

- **Frontend**: Flutter (Material 3 with custom healthcare teal `#0F766E` theme, Inter typography, responsive layouts)
- **State Management**: `Provider` with reactive inventory and alert triggers
- **Backend Database**: Google Cloud Firestore
- **Authentication**: Firebase Authentication
- **External Signals**: Live Open-Meteo precipitation API (Colombo coordinates: 6.93° N, 79.86° E)
- **Epidemiological Logic**: Port of Section 4 decision rules (Erandi et al., 2021)

## 📁 Project Structure

```text
flutter_pharmalert/
├── pubspec.yaml                 # Dependencies (Firebase Core, Firestore, Auth, Provider, etc.)
├── firestore.rules              # Production security rules for Firestore
├── lib/
│   ├── main.dart                # Application entry point & theme configuration
│   ├── firebase_options.dart    # Firebase credentials template (configurable via FlutterFire CLI)
│   ├── models/
│   │   ├── medicine.dart        # Medicine entity, stock levels, and Firestore serialization
│   │   ├── alert_item.dart      # Rule triggers, conditions, and recommended reorders
│   │   ├── environmental_signal.dart # Open-Meteo precipitation & Google Trends signals
│   │   └── user_profile.dart    # Pharmacist user model
│   ├── services/
│   │   ├── firebase_service.dart # Firestore CRUD, real-time streams & benchmark seeding
│   │   ├── weather_service.dart # Live Open-Meteo REST client with local caching
│   │   └── rule_engine.dart     # Rules R1, R2, R3, R4 & 10-week lag calibration
│   ├── providers/
│   │   └── app_provider.dart    # ChangeNotifier bridging inventory, alerts, weather & tests
│   ├── screens/
│   │   ├── login_screen.dart    # Pharmacist authentication & 1-click demo access
│   │   ├── dashboard_screen.dart# Epidemiological threat banner, bento stats & alerts
│   │   ├── alerts_list_screen.dart # Filtered list of surge recommendations
│   │   ├── alert_detail_screen.dart # Deep breakdown of rule conditions & citations
│   │   ├── inventory_screen.dart # Searchable medicine catalog with reorder bars
│   │   └── settings_screen.dart # Research benchmarks, weather sync & database reset
│   └── widgets/
│       ├── add_edit_medicine_dialog.dart # Modal to modify inventory
│       ├── rule_test_dialog.dart # Interactive runner for 5 Section 7.1 validation tests
│       └── bottom_nav_bar.dart  # Material 3 navigation bar
```

## 🛠️ How to Run

### 1. Prerequisites
- [Flutter SDK](https://flutter.dev/docs/get-started/install) (v3.2.0 or higher)
- Android Studio / Xcode / VS Code with Flutter extension
- Firebase CLI & FlutterFire CLI (optional for live Firebase sync)

### 2. Install Dependencies
```bash
cd flutter_pharmalert
flutter pub get
```

### 3. Connect Your Firebase Project
To link your own Firebase project:
```bash
# Login to Firebase
firebase login

# Configure FlutterFire for Android, iOS, and Web
flutterfire configure
```
This will automatically generate your actual `lib/firebase_options.dart` and register the apps in your Firebase console.

### 4. Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### 5. Launch the Application
```bash
# Run on connected device, emulator, or Chrome
flutter run
```
