import React, { useEffect } from "react";
import { Alert } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import PinScreen from "../../components/common/PinScreen";

type PinConfirmNavProp = NativeStackNavigationProp<RootStackParamList, "PinConfirm">;

const PinConfirmScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation<PinConfirmNavProp>();

  // รับค่า firstPin (6 หลัก) มาจาก PinEntryScreen
  const firstPinFromRoute = route.params
    ? (route.params as { firstPin: string }).firstPin
    : "";

  useEffect(() => {
    // ถ้าไม่มีค่า firstPin ให้ย้อนกลับ
    if (!firstPinFromRoute) {
      Alert.alert("ข้อผิดพลาด", "ไม่พบรหัส PIN ที่ตั้งไว้ กรุณาลองใหม่");
      navigation.goBack();
    }
  }, [firstPinFromRoute, navigation]);

  const handlePinComplete = async (pin: string) => {
    // ถ้าตรงกับ firstPin => เก็บใน SecureStore
    if (pin === firstPinFromRoute) {
      try {
        await SecureStore.setItemAsync("userPin", pin);
        // ไปหน้า Home หรือหน้าอื่นตามต้องการ
        navigation.replace("Home");
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึก PIN:", error);
        Alert.alert("ข้อผิดพลาด", "ไม่สามารถบันทึกรหัส PIN ได้ กรุณาลองใหม่");
      }
    } else {
      Alert.alert("แจ้งเตือน", "PIN ไม่ตรงกัน กรุณาลองใหม่");
    }
  };

  return (
    <PinScreen
      title="ยืนยันรหัส PIN"
      subtitle="กรุณากรอกรหัส PIN อีกครั้ง"
      description="เพื่อยืนยันการตั้งรหัส PIN"
      onPinComplete={handlePinComplete}
      onBackPress={() => navigation.goBack()}
    />
  );
};

export default PinConfirmScreen;