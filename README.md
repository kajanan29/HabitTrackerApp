# Habit Tracker App

A simple React Native habit tracking app built using React Native CLI. Users can register, log in, create and track habits, mark them as completed, and log out. Data is stored locally using `AsyncStorage`.

## 📱 Features

- User registration and login with local data storage
- Create daily or weekly habits
- Track and update habit completion
- Delete completed habits
- Clean UI built with core React Native components

## 🛠️ Tech Stack

- React Native CLI
- AsyncStorage
- React Navigation

## 🚀 Getting Started

### Prerequisites

- Node.js & npm
- Android Studio with emulator or physical device
- React Native CLI (`npm install -g react-native-cli`)
- JDK & Android SDK (configured in `ANDROID_HOME`)
- A physical or virtual Android device connected and available

### 1. Clone the repository

```bash
git clone https://github.com/kajanan29/HabitTrackerApp.git
cd HabitTrackerApp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Metro bundler

```bash
npx react-native start
```

> Open a new terminal for the next step.

### 4. Run the app on Android

```bash
npx react-native run-android
```

> Make sure an Android emulator is running or a physical device is connected.

## 💡 Common Issues

- **No connected devices**: Make sure your emulator is running or a physical device is connected.
- **`adb` not found**: Ensure `platform-tools` is in your system PATH.
- **Metro bundler not running**: Always start with `npx react-native start`.

## 🎥 Demo

👉 [Demo Video Link](https://drive.google.com/file/d/1JUsxM4NpVatd2oc84auAsDyY0F8l0GGU/view?usp=sharing)  
 

---

Made with ❤️ using React Native CLI.
