# ☕ แนวทางการร่วมพัฒนา SiamLink (Contributing Guide)

ยินดีต้อนรับนักพัฒนาชาวไทยทุกท่าน! 🎉 พวกเรามีความยินดีเป็นอย่างยิ่งที่คุณสนใจมาร่วมเป็นส่วนหนึ่งในการพัฒนา **SiamLink** แพลตฟอร์มสร้างหน้า Link-in-Bio สำหรับครีเอเตอร์ไทยที่ประณีต สวยงาม และใช้งานง่าย

เอกสารนี้จะช่วยแนะนำวิธีเริ่มตั้งค่าโครงการบนเครื่องคอมพิวเตอร์ของคุณ รวมถึงขั้นตอนในการส่งคำสั่งพัฒนา (Pull Request) กลับมายังโครงการหลักอย่างถูกต้องครับ

---

## 🛠️ การตั้งค่าเครื่องสำหรับการพัฒนาในเครื่องคอมพิวเตอร์ (Local Setup)

โครงการนี้ใช้เทคโนโลยีหลักคือ **Next.js (App Router)**, **Supabase (Database/Auth)** และ **Tailwind CSS** ในการดีไซน์

### 1. โคลนโครงการ (Fork & Clone)
เริ่มจากการโคลนโปรเจกต์นี้ลงเครื่องคอมพิวเตอร์ของคุณ:
```bash
git clone https://github.com/ThongBunjua/SiamLink.git
cd SiamLink
```

### 2. ติดตั้งโมดูลและไลบรารีที่จำเป็น
```bash
npm install
```

### 3. ตั้งค่าตัวแปรสภาพแวดล้อม (Environment Variables)
1. ทำการสร้างไฟล์ `.env.local` ขึ้นมาในโฟลเดอร์หลัก (Root Directory)
2. คัดลอกเนื้อหาการตั้งค่าตัวแปรจากไฟล์ `.env.example`
3. ใส่ค่ากุญแจ API ต่างๆ ของคุณ (Supabase, Stripe) เช่น:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### 4. รันระบบจำลองบนเครื่อง (Local Server)
เมื่อติดตั้งทุกอย่างเรียบร้อยแล้ว ให้รันเซิร์ฟเวอร์จำลองด้วยคำสั่ง:
```bash
npm run dev
```
เปิดบราวเซอร์ไปที่ [http://localhost:3000](http://localhost:3000) เพื่อดูผลลัพธ์ของโปรเจกต์สดๆ แบบเรียลไทม์!

---

## 📂 โครงสร้างโฟลเดอร์ของ SiamLink (Folder Structure)

เพื่อให้ระบบเป็นระเบียบ เรียบร้อย และแก้ไขได้ง่าย โปรดพยายามรักษาโครงสร้างโฟลเดอร์ไว้ตามกรอบนี้:
```
SiamLink/
├── public/                 # รูปภาพไอคอนและสื่อประกอบของระบบ
├── src/
│   ├── app/                # แหล่งรวม Routing ทั้งหมด (App Router)
│   │   ├── [username]/     # หน้าโปรไฟล์สาธารณะที่ครีเอเตอร์แต่ละคนจะแชร์ได้จริง
│   │   ├── api/            # บริการหลังบ้าน เช่น ระบบจ่ายเงิน /api/checkout
│   │   ├── dashboard/      # แผงควบคุมระบบ (Simulator & Editor)
│   │   └── page.tsx        # หน้าหลักพรีวิว SiamLink (Landing Page)
│   ├── components/         # คอมโพเนนต์แชร์ร่วม เช่น ปุ่ม, เมนูนำทาง
│   └── lib/                # การตั้งค่าโมดูลภายนอก, Types, และ Utils หลัก
├── supabase/               # โครงร่างฐานข้อมูลและคำสั่ง SQL (schema.sql)
└── .gitignore              # การกำหนดละเว้นไฟล์เพื่อความปลอดภัยสูง
```

---

## 🚀 ขั้นตอนการส่งผลงานร่วมพัฒนา (Pull Request Workflow)

เมื่อคุณต้องการส่งผลงานหรือฟีเจอร์ใหม่ ให้ทำตามลำดับขั้นตอนเพื่อรักษาคุณภาพโค้ดระดับสากลดังนี้ครับ:

1. **สร้างกิ่งทำงานใหม่ (Create a Feature Branch):**
   ```bash
   git checkout -b feat/your-awesome-feature
   ```
2. **คอมมิตงานของคุณ (Commit Changes):**
   เขียนข้อความอธิบายการเปลี่ยนแปลงเป็นภาษาอังกฤษแบบกระชับ (เช่น `feat: add luxury dark theme option`)
   ```bash
   git commit -m "feat: your descriptive commit message"
   ```
3. **ทดสอบความถูกต้องของโค้ด (Check Code Integrity & Types):**
   โปรดรันการทดสอบเพื่อให้มั่นใจว่าจะไม่มีข้อผิดพลาดการคอมไพล์ใดๆ เกิดขึ้น:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
4. **ส่งงานขึ้นคลังของคุณและส่งคำขอพัฒนา (Push & Pull Request):**
   ```bash
   git push origin feat/your-awesome-feature
   ```
   จากนั้นกดปุ่ม **Create Pull Request** ในหน้าเว็บ GitHub ได้ทันที!

---

## 📝 กฎการพัฒนาที่ต้องปฏิบัติตาม (Developer Code of Conduct)

- **เน้นความสวยงาม ประณีต (Aesthetics First):** หน้าตา UI ของ SiamLink ต้องเน้นการใช้งานที่ประณีต หรูหรา มินิมอล มีสีโทนคาเฟ่ คลีน ชัดเจน และมี Micro-animations เล็กน้อยเพื่อให้ระบบมีชีวิตชีวา
- **ห้ามปล่อยรหัสลับ (No Secrets Leak):** ห้ามนำกุญแจสำคัญหรือไฟล์ `.env.local` ขึ้นระบบคลังควบคุม GitHub โดยเด็ดขาด ตรวจสอบ `.gitignore` ทุกครั้งก่อนคอมมิต
- **ความลื่นไหลเป็นมิตร (Responsive Performance):** ทุกฟีเจอร์และทุกปุ่มจะต้องผ่านการทดสอบว่าสามารถใช้งานได้ลื่นไหลทั้งบน **มือถือสมาร์ทโฟน** และ **คอมพิวเตอร์พีซี** อย่างไม่มีสะดุด

ขอบคุณที่มาร่วมทำให้ SiamLink เป็นเครื่องมือที่ดีที่สุดสำหรับครีเอเตอร์ชาวไทยครับ! 🇹🇭☕✨
