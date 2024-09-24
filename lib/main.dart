import 'package:flutter/material.dart';
import 'package:saccos/screens/login.dart';

void main() {
  runApp(const SaccosApp());
}

class SaccosApp extends StatelessWidget {
  const SaccosApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: LoginScreen(),
    );
  }
}

