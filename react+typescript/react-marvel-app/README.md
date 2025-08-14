# React + TypeScript Marvel App

โปรเจกต์นี้สร้างขึ้นเพื่อการเรียนรู้และทดลองใช้งาน **React** ร่วมกับ **TypeScript** โดยใช้ [Vite](https://vitejs.dev/) เป็นเครื่องมือสำหรับพัฒนาและรันแอปพลิเคชัน

## คุณสมบัติ

- พัฒนา UI ด้วย React (ฟังก์ชันคอมโพเนนต์)
- ใช้ TypeScript เพื่อความปลอดภัยของชนิดข้อมูล
- จัดการเส้นทาง (routing) ด้วย [wouter](https://github.com/molefrog/wouter)
- ใช้ TailwindCSS สำหรับตกแต่ง UI
- ข้อมูลฮีโร่ดึงจากไฟล์ JSON ภายในโปรเจกต์

## โครงสร้างโปรเจกต์

```
src/
  components/      // คอมโพเนนต์ UI
  data/            // ข้อมูล heroes.json
  hooks/           // custom hooks
  interfaces/      // TypeScript interfaces
  pages/           // หน้าแต่ละหน้า
  App.tsx          // จุดเริ่มต้นของแอป
  main.tsx         // mount React DOM
```

## วิธีเริ่มต้นใช้งาน

1. ติดตั้ง dependencies

   ```sh
   npm install
   ```

2. รันเซิร์ฟเวอร์สำหรับพัฒนา

   ```sh
   npm run dev
   ```

3. เปิดเบราว์เซอร์ไปที่ [http://localhost:5173](http://localhost:5173)

## หมายเหตุ

- โปรเจกต์นี้เป็นการเรียนรู้เท่านั้นไม่ได้ทีเจตนาจะไป Copy ใครหรือขโมยผลงานของใคร

---
