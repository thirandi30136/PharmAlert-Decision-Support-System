import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:pharmalert/providers/app_provider.dart';
import 'package:pharmalert/screens/login_screen.dart';
import 'package:pharmalert/screens/dashboard_screen.dart';
import 'package:pharmalert/screens/alerts_list_screen.dart';
import 'package:pharmalert/screens/inventory_screen.dart';
import 'package:pharmalert/screens/settings_screen.dart';
import 'package:pharmalert/widgets/bottom_nav_bar.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Note: For local running without active Firebase connection,
  // the app gracefully operates using the Provider local state and Open-Meteo REST.
  // To connect your production Firebase:
  // await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AppProvider()),
      ],
      child: const PharmAlertApp(),
    ),
  );
}

class PharmAlertApp extends StatelessWidget {
  const PharmAlertApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'PharmAlert',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0F766E),
          primary: const Color(0xFF0F766E),
          secondary: const Color(0xFF0D5D56),
          surface: const Color(0xFFF8FAFC),
        ),
        textTheme: GoogleFonts.interTextTheme(Theme.of(context).textTheme),
        scaffoldBackgroundColor: const Color(0xFFF8FAFC),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0F766E),
          foregroundColor: Colors.white,
          centerTitle: false,
        ),
      ),
      home: const MainNavigationWrapper(),
    );
  }
}

class MainNavigationWrapper extends StatelessWidget {
  const MainNavigationWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<AppProvider>();

    if (!provider.isLoggedIn) {
      return const LoginScreen();
    }

    final screens = [
      const DashboardScreen(),
      const AlertsListScreen(),
      const InventoryScreen(),
      const SettingsScreen(),
    ];

    return Scaffold(
      body: Stack(
        children: [
          IndexedStack(
            index: provider.currentTabIndex,
            children: screens,
          ),
          if (provider.toastMessage != null)
            Positioned(
              top: 16,
              left: 20,
              right: 20,
              child: SafeArea(
                child: Material(
                  elevation: 6,
                  borderRadius: BorderRadius.circular(12),
                  color: const Color(0xFF0F172A),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    child: Text(
                      provider.toastMessage!,
                      style: const TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),
      bottomNavigationBar: const BottomNavBar(),
    );
  }
}
