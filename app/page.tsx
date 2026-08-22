/* eslint-disable */
// @ts-nocheck
"use client";
import { useState, useEffect } from "react";

// 🌟 1. FULL DICTIONARY (6 LANGUAGES + PAYMENT METHODS & IMAGE)
const translations: any = {
  "English": { 
    pos: "Point of Sale", prod: "Products & Menu", crm: "Customers", shift: "Shift Management", rep: "Reports", set: "Settings", sub: "Billing", subtotal: "Subtotal", tax: "Tax", disc: "Discount", total: "Total", pay: "Pay Now", empty: "Cart is empty", openShift: "Open Shift", closeShift: "Close Shift", addProd: "Add Product", addCat: "Add Category", name: "Name", price: "Price", cat: "Category", action: "Action", del: "Delete", dineIn: "Dine In", takeAway: "Take Away", loginBtn: "Sign In", registerBtn: "Create Account", logout: "Sign Out", selectTab: "Select Table", backTab: "Back to Tables", addTable: "Add Table",
    emailUser: "Email / Username", egEmail: "e.g. zaumunnjang@gmail.com", pass: "Password", enterPass: "Enter password...", confirmPass: "Confirm Password", confirmPassHolder: "Confirm password...", noAccount: "Don't have an account?", regHere: "Register Here", hasAccount: "Already have an account?", signInText: "Sign in to your account", createText: "Create a new enterprise account", shiftActive: "Shift Active", shiftClosed: "Shift Closed", allItems: "All Items", currentOrder: "Current Order", egTab: "e.g. VIP-3", openFloat: "Opening Float", opening: "Opening", sales: "Sales", actualCash: "Actual Cash Counted", enterCash: "Enter counted cash...", addCust: "Add Customer", custName: "Customer Name", phone: "Phone Number", save: "Save", points: "Loyalty Points", shiftHist: "Shift History", date: "Date", expected: "Expected", actual: "Actual", diff: "Difference", noRep: "No reports available.", storeProf: "Store Profile", storeNameTxt: "Store Name", taxRateTxt: "Tax Rate (%)", currText: "Currency Symbol", sysToggles: "System Toggles", enableSound: "Enable Sound (Beep)", currPlan: "Current Plan", entPro: "Enterprise PRO", active: "Active", allFeat: "All features unlocked.", modActive: "Module Active", errPass: "Passwords do not match!", errEmailExists: "Email already exists!", errInvalid: "Invalid Email or Password!", regSuccess: "Registration Successful! Please Sign In.",
    sixMonths: "6 Months Plan", oneYear: "1 Year Plan", subscribe: "Subscribe Now", bestValue: "BEST VALUE",
    Drinks: "Drinks", Food: "Food", Snacks: "Snacks", Dessert: "Dessert",
    Espresso: "Espresso", "Iced Latte": "Iced Latte", "Signature Burger": "Signature Burger", "Spicy Wings": "Spicy Wings", Cheesecake: "Cheesecake", Table: "Table",
    payMeth: "Payment Method", salesBreak: "Sales Breakdown", cash: "Cash", ewallet: "E-Wallet", debit: "Debit Card", credit: "Credit Card", onlineDel: "Online Delivery",
    imageOpt: "Image (Optional)"
  },
  "Burmese": { 
    pos: "အရောင်းစနစ်", prod: "ကုန်ပစ္စည်းများ", crm: "ဖောက်သည်များ", shift: "ဆိုင်းဖွင့်/ပိတ်", rep: "အစီရင်ခံစာ", set: "ဆက်တင်များ", sub: "လစဉ်ကြေး", subtotal: "ကျသင့်ငွေ", tax: "အခွန်", disc: "လျှော့ဈေး", total: "စုစုပေါင်း", pay: "ငွေရှင်းမည်", empty: "ဘာမှမရွေးရသေးပါ", openShift: "ဆိုင်းဖွင့်မည်", closeShift: "ဆိုင်းပိတ်မည်", addProd: "ပစ္စည်းထည့်ရန်", addCat: "အမျိုးအစားထည့်ရန်", name: "အမည်", price: "စျေးနှုန်း", cat: "အမျိုးအစား", action: "လုပ်ဆောင်ချက်", del: "ဖျက်မည်", dineIn: "ဆိုင်စား", takeAway: "ပါဆယ်", loginBtn: "အကောင့်ဝင်မည်", registerBtn: "အကောင့်သစ်ဖွင့်မည်", logout: "အကောင့်ထွက်မည်", selectTab: "စားပွဲ ရွေးချယ်ပါ", backTab: "စားပွဲများဆီသို့", addTable: "စားပွဲထည့်ရန်",
    emailUser: "အီးမေးလ် / အသုံးပြုသူအမည်", egEmail: "ဥပမာ - zaumunnjang@gmail.com", pass: "စကားဝှက်", enterPass: "စကားဝှက် ရိုက်ထည့်ပါ...", confirmPass: "စကားဝှက် အတည်ပြုပါ", confirmPassHolder: "စကားဝှက် ထပ်ရိုက်ပါ...", noAccount: "အကောင့် မရှိသေးဘူးလား?", regHere: "ဒီမှာ အကောင့်ဖွင့်ပါ", hasAccount: "အကောင့် ရှိပြီးသားလား?", signInText: "အကောင့်သို့ ဝင်ရောက်ရန်", createText: "လုပ်ငန်းသုံး အကောင့်သစ် ဖွင့်ရန်", shiftActive: "ဆိုင်းဖွင့်ထားသည်", shiftClosed: "ဆိုင်းပိတ်ထားသည်", allItems: "ပစ္စည်းအားလုံး", currentOrder: "လက်ရှိ အော်ဒါ", egTab: "ဥပမာ - VIP-3", openFloat: "အဖွင့် ငွေလက်ကျန်", opening: "အဖွင့်ငွေ", sales: "အရောင်း", actualCash: "လက်ရှိ ရေတွက်ရရှိငွေ", enterCash: "ရေတွက်ရရှိငွေ ထည့်ပါ...", addCust: "ဖောက်သည် ထည့်ရန်", custName: "ဖောက်သည် အမည်", phone: "ဖုန်းနံပါတ်", save: "သိမ်းမည်", points: "ရမှတ်များ", shiftHist: "ဆိုင်း မှတ်တမ်း", date: "ရက်စွဲ", expected: "မျှော်မှန်းငွေ", actual: "လက်တွေ့ငွေ", diff: "ကွာဟချက်", noRep: "မှတ်တမ်း မရှိသေးပါ။", storeProf: "ဆိုင် အချက်အလက်", storeNameTxt: "ဆိုင် အမည်", taxRateTxt: "အခွန်နှုန်း (%)", currText: "ငွေကြေး ယူနစ်", sysToggles: "စနစ် အဖွင့်/အပိတ်", enableSound: "အသံ ဖွင့်မည် (Beep)", currPlan: "လက်ရှိ အစီအစဉ်", entPro: "လုပ်ငန်းသုံး အဆင့်မြင့်", active: "အသုံးပြုနေသည်", allFeat: "လုပ်ဆောင်ချက်အားလုံး ရရှိနိုင်ပါသည်။", modActive: "အခန်း ဖွင့်ထားပါသည်။", errPass: "စကားဝှက်များ မတူညီပါ!", errEmailExists: "အီးမေးလ် ရှိပြီးသားဖြစ်နေပါသည်!", errInvalid: "အီးမေးလ် သို့မဟုတ် စကားဝှက် မှားယွင်းနေပါသည်!", regSuccess: "အကောင့်ဖွင့်ခြင်း အောင်မြင်ပါသည်။ ကျေးဇူးပြု၍ ဝင်ရောက်ပါ။",
    sixMonths: "၆ လ အစီအစဉ်", oneYear: "၁ နှစ် အစီအစဉ်", subscribe: "ဝယ်ယူမည်", bestValue: "အကောင်းဆုံး",
    Drinks: "အအေးများ", Food: "အစားအစာ", Snacks: "အဆာပြေ", Dessert: "အချိုပွဲ",
    Espresso: "အက်စ်ပရက်ဆို", "Iced Latte": "ရေခဲလတ်တေး", "Signature Burger": "ဘာဂါအထူး", "Spicy Wings": "ကြက်တောင်ပံစပ်", Cheesecake: "ချိစ်ကိတ်", Table: "စားပွဲ",
    payMeth: "ငွေချေမည့်စနစ်", salesBreak: "အရောင်း ခွဲခြမ်းစိတ်ဖြာမှု", cash: "ငွေသား", ewallet: "အီးဝေါလက် (KPay/Wave)", debit: "ဒက်ဘစ်ကတ်", credit: "ခရက်ဒစ်ကတ်", onlineDel: "အွန်လိုင်း Delivery",
    imageOpt: "ပုံထည့်ရန် (မထည့်လည်းရသည်)"
  },
  "Chinese": { 
    pos: "销售系统", prod: "产品与菜单", crm: "客户", shift: "交接班管理", rep: "报告", set: "设置", sub: "账单", subtotal: "小计", tax: "税", disc: "折扣", total: "总计", pay: "立即付款", empty: "购物车为空", openShift: "开始营业", closeShift: "结束营业", addProd: "添加产品", addCat: "添加类别", name: "名称", price: "价格", cat: "类别", action: "操作", del: "删除", dineIn: "堂食", takeAway: "外带", loginBtn: "登录", registerBtn: "创建账号", logout: "登出", selectTab: "选择桌子", backTab: "返回桌子", addTable: "添加桌子",
    emailUser: "电子邮件 / 用户名", egEmail: "例如：zaumunnjang@gmail.com", pass: "密码", enterPass: "输入密码...", confirmPass: "确认密码", confirmPassHolder: "确认您的密码...", noAccount: "没有账号？", regHere: "在这里注册", hasAccount: "已经有账号？", signInText: "登录您的账号", createText: "创建一个新的企业账号", shiftActive: "营业中", shiftClosed: "已结业", allItems: "所有项目", currentOrder: "当前订单", egTab: "例如：VIP-3", openFloat: "开班备用金", opening: "开班金额", sales: "销售额", actualCash: "实际清点现金", enterCash: "输入清点金额...", addCust: "添加客户", custName: "客户姓名", phone: "电话号码", save: "保存", points: "积分", shiftHist: "交接班历史", date: "日期", expected: "应有金额", actual: "实际金额", diff: "差额", noRep: "暂无报告。", storeProf: "店铺资料", storeNameTxt: "店铺名称", taxRateTxt: "税率 (%)", currText: "货币符号", sysToggles: "系统开关", enableSound: "开启声音 (提示音)", currPlan: "当前计划", entPro: "企业高级版", active: "活跃", allFeat: "已解锁所有功能。", modActive: "模块已激活", errPass: "密码不匹配！", errEmailExists: "电子邮件已存在！", errInvalid: "电子邮件或密码无效！", regSuccess: "注册成功！请登录。",
    sixMonths: "6个月计划", oneYear: "1年计划", subscribe: "立即订阅", bestValue: "超值推荐",
    Drinks: "饮料", Food: "食品", Snacks: "小吃", Dessert: "甜点",
    Espresso: "浓缩咖啡", "Iced Latte": "冰拿铁", "Signature Burger": "招牌汉堡", "Spicy Wings": "香辣鸡翅", Cheesecake: "芝士蛋糕", Table: "桌子",
    payMeth: "支付方式", salesBreak: "销售明细", cash: "现金", ewallet: "电子钱包", debit: "借记卡", credit: "信用卡", onlineDel: "在线外卖",
    imageOpt: "图片（可选）"
  },
  "Thai": { 
    pos: "จุดขาย (POS)", prod: "สินค้าและเมนู", crm: "ลูกค้า", shift: "จัดการกะ", rep: "รายงาน", set: "การตั้งค่า", sub: "การเรียกเก็บเงิน", subtotal: "ยอดรวมย่อย", tax: "ภาษี", disc: "ส่วนลด", total: "รวมทั้งหมด", pay: "ชำระเงิน", empty: "ตะกร้าว่างเปล่า", openShift: "เปิดกะ", closeShift: "ปิดกะ", addProd: "เพิ่มสินค้า", addCat: "เพิ่มหมวดหมู่", name: "ชื่อ", price: "ราคา", cat: "หมวดหมู่", action: "การกระทำ", del: "ลบ", dineIn: "ทานที่ร้าน", takeAway: "สั่งกลับบ้าน", loginBtn: "เข้าสู่ระบบ", registerBtn: "สร้างบัญชี", logout: "ออกจากระบบ", selectTab: "เลือกโต๊ะ", backTab: "กลับไปที่โต๊ะ", addTable: "เพิ่มโต๊ะ",
    emailUser: "อีเมล / ชื่อผู้ใช้", egEmail: "เช่น zaumunnjang@gmail.com", pass: "รหัสผ่าน", enterPass: "ป้อนรหัสผ่าน...", confirmPass: "ยืนยันรหัสผ่าน", confirmPassHolder: "ยืนยันรหัสผ่านของคุณ...", noAccount: "ยังไม่มีบัญชี?", regHere: "ลงทะเบียนที่นี่", hasAccount: "มีบัญชีอยู่แล้ว?", signInText: "เข้าสู่ระบบบัญชีของคุณ", createText: "สร้างบัญชีองค์กรใหม่", shiftActive: "กะทำงานเปิด", shiftClosed: "กะทำงานปิด", allItems: "รายการทั้งหมด", currentOrder: "คำสั่งซื้อปัจจุบัน", egTab: "เช่น VIP-3", openFloat: "เงินทอนเปิดกะ", opening: "เงินเปิดกะ", sales: "ยอดขาย", actualCash: "เงินสดที่นับได้", enterCash: "ใส่จำนวนเงินที่นับ...", addCust: "เพิ่มลูกค้า", custName: "ชื่อลูกค้า", phone: "เบอร์โทรศัพท์", save: "บันทึก", points: "คะแนนสะสม", shiftHist: "ประวัติกะ", date: "วันที่", expected: "คาดหวัง", actual: "ตามจริง", diff: "ส่วนต่าง", noRep: "ไม่มีรายงาน", storeProf: "ข้อมูลร้านค้า", storeNameTxt: "ชื่อร้าน", taxRateTxt: "อัตราภาษี (%)", currText: "สกุลเงิน", sysToggles: "ระบบสลับ", enableSound: "เปิดเสียง (บี๊บ)", currPlan: "แผนปัจจุบัน", entPro: "ระดับองค์กรโปร", active: "ใช้งานอยู่", allFeat: "ปลดล็อคคุณสมบัติทั้งหมดแล้ว", modActive: "โมดูลทำงานอยู่", errPass: "รหัสผ่านไม่ตรงกัน!", errEmailExists: "อีเมลนี้มีอยู่แล้ว!", errInvalid: "อีเมลหรือรหัสผ่านไม่ถูกต้อง!", regSuccess: "ลงทะเบียนสำเร็จ! กรุณาเข้าสู่ระบบ",
    sixMonths: "แผน 6 เดือน", oneYear: "แผน 1 ปี", subscribe: "สมัครสมาชิก", bestValue: "คุ้มค่าที่สุด",
    Drinks: "เครื่องดื่ม", Food: "อาหาร", Snacks: "ของว่าง", Dessert: "ของหวาน",
    Espresso: "เอสเปรสโซ", "Iced Latte": "ลาเต้เย็น", "Signature Burger": "เบอร์เกอร์ซิกเนเจอร์", "Spicy Wings": "ปีกไก่เผ็ด", Cheesecake: "ชีสเค้ก", Table: "โต๊ะ",
    payMeth: "วิธีการชำระเงิน", salesBreak: "รายละเอียดการขาย", cash: "เงินสด", ewallet: "อีวอลเล็ต", debit: "บัตรเดบิต", credit: "บัตรเครดิต", onlineDel: "จัดส่งออนไลน์",
    imageOpt: "รูปภาพ (ไม่บังคับ)"
  },
  "Korean": { 
    pos: "판매 시점 (POS)", prod: "제품 및 메뉴", crm: "고객", shift: "교대 관리", rep: "보고서", set: "설정", sub: "결제", subtotal: "소계", tax: "세금", disc: "할인", total: "총액", pay: "결제하기", empty: "장바구니가 비어 있습니다", openShift: "교대 시작", closeShift: "교대 마감", addProd: "제품 추가", addCat: "카테고리 추가", name: "이름", price: "가격", cat: "카테고리", action: "작업", del: "삭제", dineIn: "매장 식사", takeAway: "포장", loginBtn: "로그인", registerBtn: "계정 만들기", logout: "로그아웃", selectTab: "테이블 선택", backTab: "테이블로 돌아가기", addTable: "테이블 추가",
    emailUser: "이메일 / 사용자 이름", egEmail: "예: zaumunnjang@gmail.com", pass: "비밀번호", enterPass: "비밀번호 입력...", confirmPass: "비밀번호 확인", confirmPassHolder: "비밀번호를 확인하세요...", noAccount: "계정이 없으신가요?", regHere: "여기서 등록하세요", hasAccount: "이미 계정이 있으신가요?", signInText: "계정에 로그인하세요", createText: "새 기업 계정 만들기", shiftActive: "영업 중", shiftClosed: "영업 종료", allItems: "모든 항목", currentOrder: "현재 주문", egTab: "예: VIP-3", openFloat: "오픈 준비금", opening: "시작 금액", sales: "매출", actualCash: "실제 현금", enterCash: "현금 입력...", addCust: "고객 추가", custName: "고객 이름", phone: "전화번호", save: "저장", points: "포인트", shiftHist: "교대 내역", date: "날짜", expected: "예상 금액", actual: "실제 금액", diff: "차액", noRep: "보고서가 없습니다.", storeProf: "상점 프로필", storeNameTxt: "상점 이름", taxRateTxt: "세율 (%)", currText: "통화 기호", sysToggles: "시스템 전환", enableSound: "소리 켜기 (비프음)", currPlan: "현재 요금제", entPro: "엔터프라이즈 프로", active: "활성", allFeat: "모든 기능이 잠금 해제되었습니다.", modActive: "모듈 활성화됨", errPass: "비밀번호가 일치하지 않습니다!", errEmailExists: "이미 존재하는 이메일입니다!", errInvalid: "이메일 또는 비밀번호가 잘못되었습니다!", regSuccess: "등록 성공! 로그인해 주세요.",
    sixMonths: "6개월 요금제", oneYear: "1년 요금제", subscribe: "구독하기", bestValue: "최고의 가치",
    Drinks: "음료", Food: "음식", Snacks: "스낵", Dessert: "디저트",
    Espresso: "에스프레소", "Iced Latte": "아이스 라떼", "Signature Burger": "시그니처 버거", "Spicy Wings": "매운 닭날개", Cheesecake: "치즈케이크", Table: "테이블",
    payMeth: "결제 방법", salesBreak: "판매 내역", cash: "현금", ewallet: "전자 지갑", debit: "직불 카드", credit: "신용 카드", onlineDel: "온라인 배달",
    imageOpt: "이미지 (선택 사항)"
  },
  "Malay": { 
    pos: "Sistem Jualan (POS)", prod: "Produk & Menu", crm: "Pelanggan", syif: "Pengurusan Syif", rep: "Laporan", set: "Tetapan", sub: "Bil", subtotal: "Jumlah Kecil", tax: "Cukai", disc: "Diskaun", total: "Jumlah", pay: "Bayar Sekarang", empty: "Troli kosong", openShift: "Buka Syif", closeShift: "Tutup Syif", addProd: "Tambah Produk", addCat: "Tambah Kategori", name: "Nama", price: "Harga", cat: "Kategori", action: "Tindakan", del: "Padam", dineIn: "Makan Sini", takeAway: "Bungkus", loginBtn: "Log Masuk", registerBtn: "Daftar Akaun", logout: "Log Keluar", selectTab: "Pilih Meja", backTab: "Kembali ke Meja", addTable: "Tambah Meja",
    emailUser: "E-mel / Nama Pengguna", egEmail: "cth. zaumunnjang@gmail.com", pass: "Kata Laluan", enterPass: "Masukkan kata laluan...", confirmPass: "Sahkan Kata Laluan", confirmPassHolder: "Sahkan kata laluan anda...", noAccount: "Belum ada akaun?", regHere: "Daftar Di Sini", hasAccount: "Sudah ada akaun?", signInText: "Log masuk ke akaun anda", createText: "Cipta akaun perusahaan baharu", shiftActive: "Syif Aktif", shiftClosed: "Syif Ditutup", allItems: "Semua Item", currentOrder: "Pesanan Semasa", egTab: "cth. VIP-3", openFloat: "Wang Baki Awal", opening: "Pembukaan", sales: "Jualan", actualCash: "Wang Tunai Sebenar", enterCash: "Masukkan jumlah dikira...", addCust: "Tambah Pelanggan", custName: "Nama Pelanggan", phone: "Nombor Telefon", save: "Simpan", points: "Mata Ganjaran", shiftHist: "Sejarah Syif", date: "Tarikh", expected: "Dijangka", actual: "Sebenar", diff: "Perbezaan", noRep: "Tiada laporan tersedia.", storeProf: "Profil Kedai", storeNameTxt: "Nama Kedai", taxRateTxt: "Kadar Cukai (%)", currText: "Simbol Mata Wang", sysToggles: "Togol Sistem", enableSound: "Aktifkan Bunyi (Beep)", currPlan: "Pelan Semasa", entPro: "Perusahaan PRO", active: "Aktif", allFeat: "Semua ciri dibuka.", modActive: "Modul Aktif", errPass: "Kata laluan tidak sepadan!", errEmailExists: "E-mel sudah wujud!", errInvalid: "E-mel atau Kata Laluan tidak sah!", regSuccess: "Pendaftaran Berjaya! Sila Log Masuk.",
    sixMonths: "Pelan 6 Bulan", oneYear: "Pelan 1 Tahun", subscribe: "Langgan Sekarang", bestValue: "NILAI TERBAIK",
    Drinks: "Minuman", Food: "Makanan", Snacks: "Snek", Dessert: "Pencuci Mulut",
    Espresso: "Espresso", "Iced Latte": "Latte Ais", "Signature Burger": "Burger Istimewa", "Spicy Wings": "Kepak Pedas", Cheesecake: "Kek Keju", Table: "Meja",
    payMeth: "Kaedah Pembayaran", salesBreak: "Pecahan Jualan", cash: "Tunai", ewallet: "E-Dompet", debit: "Kad Debit", credit: "Kad Kredit", onlineDel: "Penghantaran",
    imageOpt: "Imej (Pilihan)"
  }
};

const LANGUAGES = ["English", "Burmese", "Chinese", "Thai", "Korean", "Malay"];
const PAYMENT_METHODS = ["Cash", "E-Wallet", "Debit Card", "Credit Card", "Online Delivery"];
const INITIAL_SALES_BY_METHOD = { "Cash": 0, "E-Wallet": 0, "Debit Card": 0, "Credit Card": 0, "Online Delivery": 0 };

export default function GlobalPOSApp() {
  const [isMounted, setIsMounted] = useState(false);

  // 🌟 LOGIN & REGISTER STATES
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState("login"); 
  
  const [usersDB, setUsersDB] = useState([
    { username: "zaumunnjang@gmail.com", password: "NJANG@123456" }
  ]);
  
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirm, setAuthConfirm] = useState("");

  // 🌟 GLOBAL STATES
  const [activeModule, setActiveMenu] = useState("pos");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [storeName, setStoreName] = useState("GlobalPos"); 
  const [language, setLanguage] = useState("English");
  const [currency, setCurrency] = useState("MMK"); 
  const [taxRate, setTaxRate] = useState(5);
  const [prefAudio, setPrefAudio] = useState(true);
  
  const t = translations[language] || translations["English"];
  const isRTL = language === "Arabic";

  const tr = (key: string) => t[key] || key;
  const payTrans: any = { "Cash": t.cash, "E-Wallet": t.ewallet, "Debit Card": t.debit, "Credit Card": t.credit, "Online Delivery": t.onlineDel };

  // 🌟 SHIFT & POS STATES
  const [shift, setShift] = useState({ isOpen: false, openingCash: 0, sales: 0, payIn: 0, payOut: 0, start: "", salesByMethod: INITIAL_SALES_BY_METHOD });
  const [openInput, setOpenInput] = useState("");
  const [actualCash, setActualCash] = useState("");
  const [shiftHistory, setShiftHistory] = useState<any[]>([]);

  const [categories, setCategories] = useState(["Drinks", "Food", "Snacks", "Dessert"]);
  
  // 🌟 PRODUCTS WITH IMAGES
  const [products, setProducts] = useState([
    { id: 1, name: "Espresso", price: 2500, category: "Drinks", emoji: "☕", image: "https://images.unsplash.com/photo-1510040989397-9e450bd68ca9?w=200&q=80" },
    { id: 2, name: "Iced Latte", price: 3500, category: "Drinks", emoji: "🥤", image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=200&q=80" },
    { id: 3, name: "Signature Burger", price: 5000, category: "Food", emoji: "🍔", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80" },
    { id: 4, name: "Spicy Wings", price: 4500, category: "Snacks", emoji: "🍗", image: "https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=200&q=80" },
    { id: 5, name: "Cheesecake", price: 3500, category: "Dessert", emoji: "🍰", image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=200&q=80" },
  ]);
  const [newProdName, setNewProdName] = useState("");
  const [newProdPrice, setNewProdPrice] = useState("");
  const [newProdCat, setNewProdCat] = useState("Drinks");
  const [newProdImage, setNewProdImage] = useState<string | null>(null);
  const [newCatName, setNewCatName] = useState("");

  const [tables, setTables] = useState<string[]>([]);
  const [newTableName, setNewTableName] = useState("");
  const [activeTable, setActiveTable] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const TABLES_PER_PAGE = 20;

  const [customers, setCustomers] = useState([{ id: 1, name: "John Doe", phone: "0912345678", points: 150 }]);
  const [newCustName, setNewCustName] = useState("");
  const [newCustPhone, setNewCustPhone] = useState("");

  const [cart, setCart] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);
  const [orderType, setOrderType] = useState("Dine In");
  const [paymentMethod, setPaymentMethod] = useState("Cash"); 
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    setIsMounted(true);
    const storedUsers = localStorage.getItem("zma_pos_users");
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      const combinedUsers = [...usersDB, ...parsedUsers.filter((u:any) => u.username !== "zaumunnjang@gmail.com")];
      setUsersDB(combinedUsers);
    }
    const storedLogin = localStorage.getItem("zma_pos_logged_in");
    if (storedLogin === "true") setIsLoggedIn(true);

    const storedTables = localStorage.getItem("zma_pos_tables");
    if (storedTables) {
      setTables(JSON.parse(storedTables));
    } else {
      const defaultTables = Array.from({length: 15}, (_, i) => `Table ${i + 1}`);
      setTables(defaultTables);
      localStorage.setItem("zma_pos_tables", JSON.stringify(defaultTables));
    }
    
    const storedCurr = localStorage.getItem("zma_pos_curr");
    if (storedCurr) setCurrency(storedCurr);
  }, []);

  const playBeep = () => { if (!prefAudio) return; try { const ctx = new (window.AudioContext || (window as any).webkitAudioContext)(); const osc = ctx.createOscillator(); osc.type="square"; osc.frequency.setValueAtTime(500, ctx.currentTime); osc.connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.05); } catch(e) {} };
  
  const handleAuth = (e: any) => {
    e.preventDefault();
    if (authMode === "login") {
      const user = usersDB.find(u => u.username === authUsername && u.password === authPassword);
      if (user) { setIsLoggedIn(true); localStorage.setItem("zma_pos_logged_in", "true"); playBeep(); } 
      else { alert(t.errInvalid); }
    } else {
      if (authPassword !== authConfirm) return alert(t.errPass);
      const userExists = usersDB.find(u => u.username === authUsername);
      if (userExists) return alert(t.errEmailExists);
      const newUsers = [...usersDB, { username: authUsername, password: authPassword }];
      setUsersDB(newUsers);
      localStorage.setItem("zma_pos_users", JSON.stringify(newUsers));
      alert(t.regSuccess); setAuthMode("login"); setAuthPassword(""); setAuthConfirm("");
    }
  };

  const handleLogout = () => { if(confirm("Are you sure?")) { setIsLoggedIn(false); localStorage.removeItem("zma_pos_logged_in"); setAuthUsername(""); setAuthPassword(""); } };
  const navigate = (mod: string) => { setActiveMenu(mod); setIsMobileMenuOpen(false); playBeep(); };

  const handleAddTable = (e: any) => {
    e.preventDefault();
    if (newTableName.trim() && !tables.includes(newTableName.trim())) {
      const updatedTables = [...tables, newTableName.trim()];
      setTables(updatedTables);
      localStorage.setItem("zma_pos_tables", JSON.stringify(updatedTables));
      setNewTableName("");
      playBeep();
      const newTotalPages = Math.ceil(updatedTables.length / TABLES_PER_PAGE);
      setCurrentPage(newTotalPages);
    }
  };

  const handleSelectTable = (tName: string) => { if (!shift.isOpen) { alert("⚠️ Please Open Shift first in Settings!"); navigate("shift"); return; } setActiveTable(tName); setOrderType(t.dineIn); playBeep(); };
  const handleBackToTables = () => { setActiveTable(null); setCart([]); playBeep(); };

  const addToCart = (p: any) => { playBeep(); const item = cart.find(i => i.id === p.id); if (item) setCart(cart.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i)); else setCart([...cart, { ...p, qty: 1 }]); };
  const updateQty = (id: number, delta: number) => { playBeep(); setCart(cart.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0)); };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const total = Math.max(0, subtotal + taxAmount - discount);
  
  const handleCheckout = () => { 
    if (!shift.isOpen || cart.length === 0) return; 
    const newSalesByMethod: any = { ...shift.salesByMethod };
    newSalesByMethod[paymentMethod] = (newSalesByMethod[paymentMethod] || 0) + total;
    setShift({ ...shift, sales: shift.sales + total, salesByMethod: newSalesByMethod }); 
    setCart([]); 
    setDiscount(0); 
    setActiveTable(null); 
    playBeep(); 
    alert(`✅ Payment Successful!\nTable: ${activeTable?.replace("Table", t.Table || "Table")}\nMethod: ${payTrans[paymentMethod]}\nTotal: ${total} ${currency}`); 
  };

  const handleOpenShift = () => { setShift({ isOpen: true, openingCash: Number(openInput) || 0, sales: 0, payIn: 0, payOut: 0, start: new Date().toLocaleString(), salesByMethod: INITIAL_SALES_BY_METHOD }); setOpenInput(""); playBeep(); };
  const handleCloseShift = () => { 
    const expected = shift.openingCash + shift.sales + shift.payIn - shift.payOut; 
    const diff = (Number(actualCash) || 0) - expected; 
    setShiftHistory([{ date: new Date().toLocaleString(), expected, actual: actualCash, diff, salesByMethod: shift.salesByMethod }, ...shiftHistory]); 
    alert(`Shift Closed.\nExpected: ${expected}\nActual: ${actualCash}`); 
    setShift({ isOpen: false, openingCash: 0, sales: 0, payIn: 0, payOut: 0, start: "", salesByMethod: INITIAL_SALES_BY_METHOD }); 
    setActualCash(""); 
    playBeep(); 
  };

  const handleAddCat = (e:any) => { e.preventDefault(); if (newCatName && !categories.includes(newCatName)) { setCategories([...categories, newCatName]); setNewProdCat(newCatName); } setNewCatName(""); playBeep(); };
  
  const handleImageUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setNewProdImage(reader.result as string); };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProd = (e:any) => { 
    e.preventDefault(); 
    if (!newProdName || !newProdPrice) return; 
    setProducts([{ id: Date.now(), name: newProdName, price: Number(newProdPrice), category: newProdCat, emoji: "📦", image: newProdImage || "" }, ...products]); 
    setNewProdName(""); 
    setNewProdPrice(""); 
    setNewProdImage(null); 
    playBeep(); 
  };

  const handleAddCust = (e:any) => { e.preventDefault(); if (!newCustName) return; setCustomers([{ id: Date.now(), name: newCustName, phone: newCustPhone, points: 0 }, ...customers]); setNewCustName(""); setNewCustPhone(""); playBeep(); };
  const handleSaveCurrency = (val: string) => { setCurrency(val); localStorage.setItem("zma_pos_curr", val); };
  const handleSubscribe = (plan: string) => { alert(`Thank you for choosing the ${plan}! Please contact admin to complete payment.`); playBeep(); };

  const filteredProducts = products.filter(p => (activeCategory === "All" || p.category === activeCategory));
  const totalPages = Math.ceil(tables.length / TABLES_PER_PAGE);
  const currentTables = tables.slice((currentPage - 1) * TABLES_PER_PAGE, currentPage * TABLES_PER_PAGE);

  const menus = [
    { id: "pos", icon: "❖", label: t.pos },
    { id: "products", icon: "📦", label: t.prod },
    { id: "customers", icon: "👥", label: t.crm },
    { id: "shift", icon: "🕒", label: t.shift },
    { id: "reports", icon: "📈", label: t.rep },
    { id: "settings", icon: "⛭", label: t.set },
    { id: "billing", icon: "💳", label: t.sub }
  ];

  if (!isMounted) return null;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 font-sans text-white">
        <div className="w-full max-w-md bg-[#18181b] border border-[#27272a] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#ea580c] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="text-center mb-8 relative z-10">
            <div className="w-16 h-16 bg-[#ea580c]/10 text-[#ea580c] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 border border-[#ea580c]/30">❖</div>
            <h1 className="text-3xl font-black tracking-widest text-white mb-1">GlobalPos</h1>
            <p className="text-[#ea580c] text-[10px] font-black tracking-widest mb-4">by njangzaumun</p>
            <p className="text-gray-500 text-sm font-medium">{authMode === "login" ? t.signInText : t.createText}</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4 relative z-10">
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">{t.emailUser}</label><input type="text" required value={authUsername} onChange={(e) => setAuthUsername(e.target.value)} placeholder={t.egEmail} className="w-full bg-[#09090b] border border-[#27272a] text-white px-4 py-3.5 rounded-xl outline-none focus:border-[#ea580c] transition-colors font-medium" /></div>
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">{t.pass}</label><input type="password" required value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder={t.enterPass} className="w-full bg-[#09090b] border border-[#27272a] text-white px-4 py-3.5 rounded-xl outline-none focus:border-[#ea580c] transition-colors font-medium" /></div>
            {authMode === "register" && <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">{t.confirmPass}</label><input type="password" required value={authConfirm} onChange={(e) => setAuthConfirm(e.target.value)} placeholder={t.confirmPassHolder} className="w-full bg-[#09090b] border border-[#27272a] text-white px-4 py-3.5 rounded-xl outline-none focus:border-[#ea580c] transition-colors font-medium" /></div>}
            <button type="submit" className="w-full bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold py-4 rounded-xl mt-4 transition-all shadow-[0_0_20px_rgba(234,88,12,0.2)] tracking-wider uppercase">{authMode === "login" ? t.loginBtn : t.registerBtn}</button>
          </form>
          <div className="mt-6 text-center text-sm text-gray-500 relative z-10">
            {authMode === "login" ? <p>{t.noAccount} <span onClick={() => {setAuthMode("register"); setAuthPassword("");}} className="text-[#ea580c] font-bold cursor-pointer hover:underline">{t.regHere}</span></p> : <p>{t.hasAccount} <span onClick={() => {setAuthMode("login"); setAuthPassword(""); setAuthConfirm("");}} className="text-[#ea580c] font-bold cursor-pointer hover:underline">{t.loginBtn}</span></p>}
          </div>
          <div className="mt-4 flex justify-center gap-2 relative z-10">
            <select value={language} onChange={(e)=>setLanguage(e.target.value)} className="bg-[#18181b] text-gray-400 border border-[#27272a] rounded-lg p-1 text-xs font-bold outline-none cursor-pointer">{LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}</select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-[#09090b] font-sans text-gray-200 overflow-hidden" dir={isRTL ? "rtl" : "ltr"}>
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/80 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>}

      <div className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 w-72 bg-[#18181b] border-[#27272a] flex flex-col shadow-2xl z-40 transition-transform duration-300 ease-in-out border-r`}>
        <div className="p-6 border-b border-[#27272a] flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-white tracking-widest">GlobalPos</h1>
            <p className="text-[#ea580c] text-[10px] font-black tracking-widest mt-0.5">by njangzaumun</p>
            <div className={`mt-3 text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-widest inline-flex items-center gap-2 ${shift.isOpen ? "text-[#ea580c] bg-[#ea580c]/10 border-[#ea580c]/30" : "text-gray-500 bg-[#27272a] border-[#3f3f46]"}`}><span className={`w-1.5 h-1.5 rounded-full ${shift.isOpen ? "bg-[#ea580c] animate-pulse" : "bg-gray-500"}`}></span> {shift.isOpen ? t.shiftActive : t.shiftClosed}</div>
          </div>
          <button className="md:hidden text-2xl text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>×</button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2 custom-scrollbar">
          {menus.map(m => (
            <button key={m.id} onClick={() => navigate(m.id)} className={`w-full flex items-center p-3.5 rounded-xl font-bold transition-all ${activeModule === m.id ? "bg-[#ea580c]/10 text-[#ea580c] border border-[#ea580c]/30" : "text-gray-400 hover:bg-[#27272a] hover:text-white border border-transparent"}`}><span className="text-xl mr-4">{m.icon}</span> <span>{m.label}</span></button>
          ))}
        </nav>
        <div className="p-4 border-t border-[#27272a]">
          <button onClick={handleLogout} className="w-full flex items-center p-3 rounded-xl font-bold text-red-500 hover:bg-red-500/10 transition-all border border-transparent"><span className="text-xl mr-4">🚪</span> <span>{t.logout}</span></button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-hidden w-full">
        <header className="h-16 bg-[#18181b] border-b border-[#27272a] flex items-center justify-between px-4 md:px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-2xl text-gray-400 p-2" onClick={() => setIsMobileMenuOpen(true)}>☰</button>
            <h2 className="text-xl font-black text-white hidden sm:block uppercase tracking-wider">{menus.find(m => m.id === activeModule)?.label}</h2>
          </div>
          <div className="flex items-center gap-3">
            <select value={language} onChange={(e)=>setLanguage(e.target.value)} className="bg-[#27272a] text-white border-none rounded-lg p-2 text-sm font-bold outline-none cursor-pointer">{LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}</select>
          </div>
        </header>

        <main className="flex-1 overflow-hidden bg-[#09090b] flex flex-col">
          {activeModule === "pos" && (
            <div className="flex flex-col h-full">
              {!activeTable ? (
                <div className="flex-1 flex flex-col overflow-hidden p-4 md:p-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 shrink-0">
                    <h3 className="text-2xl font-black text-white">{t.selectTab}</h3>
                    <form onSubmit={handleAddTable} className="flex gap-2">
                      <input type="text" value={newTableName} onChange={(e) => setNewTableName(e.target.value)} placeholder={t.egTab} className="w-32 sm:w-48 bg-[#18181b] border border-[#27272a] text-white px-4 py-2 rounded-xl outline-none focus:border-[#ea580c] font-medium text-sm" required />
                      <button type="submit" className="bg-[#ea580c] hover:bg-[#c2410c] text-white font-bold px-4 py-2 rounded-xl transition-all shadow-md text-sm whitespace-nowrap">
                        + {t.addTable}
                      </button>
                    </form>
                  </div>

                  <div className="flex-1 overflow-y-auto pb-4 custom-scrollbar">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
                      {currentTables.map(table => (
                        <button key={table} onClick={() => handleSelectTable(table)} className="aspect-square bg-[#18181b] border border-[#27272a] hover:border-[#ea580c] hover:bg-[#27272a] rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:-translate-y-1 shadow-sm group">
                          <span className="font-black text-white text-base md:text-xl text-center px-2 break-words line-clamp-2">{table.replace("Table", t.Table || "Table")}</span>
                          <span className="w-8 h-1 rounded-full bg-[#ea580c]/50 group-hover:bg-[#ea580c] transition-colors"></span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center gap-2 pt-4 border-t border-[#27272a] shrink-0 overflow-x-auto">
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button key={i} onClick={() => {setCurrentPage(i + 1); playBeep();}} className={`shrink-0 w-10 h-10 rounded-xl font-bold text-sm transition-all shadow-sm ${currentPage === i + 1 ? "bg-[#ea580c] text-white border-transparent" : "bg-[#18181b] text-gray-400 hover:text-white border border-[#27272a] hover:border-gray-500"}`}>
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                  <div className="flex-1 flex flex-col h-full overflow-hidden p-4 md:p-6">
                    <div className="flex justify-between items-center mb-6 shrink-0">
                      <button onClick={handleBackToTables} className="bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] text-gray-300 font-bold px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
                        <span>←</span> <span className="hidden sm:inline">{t.backTab}</span>
                      </button>
                      <div className="bg-[#ea580c]/10 border border-[#ea580c]/30 text-[#ea580c] font-black px-6 py-2.5 rounded-xl uppercase tracking-widest text-sm shadow-[0_0_15px_rgba(234,88,12,0.1)]">
                        {activeTable.replace("Table", t.Table || "Table")}
                      </div>
                    </div>
                    <div className="shrink-0 mb-6">
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                        <button onClick={() => {setActiveCategory("All"); playBeep();}} className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all border ${activeCategory === "All" ? "bg-[#ea580c] text-white border-[#ea580c] shadow-[0_0_15px_rgba(234,88,12,0.3)]" : "bg-[#18181b] text-gray-400 border-[#27272a] hover:text-white hover:bg-[#27272a]"}`}>{t.allItems}</button>
                        {categories.map(cat => (
                          <button key={cat} onClick={() => {setActiveCategory(cat); playBeep();}} className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all border ${activeCategory === cat ? "bg-[#ea580c] text-white border-[#ea580c] shadow-[0_0_15px_rgba(234,88,12,0.3)]" : "bg-[#18181b] text-gray-400 border-[#27272a] hover:text-white hover:bg-[#27272a]"}`}>{tr(cat)}</button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
                      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(p => (
                          <button key={p.id} onClick={() => addToCart(p)} className="bg-[#18181b] p-4 rounded-3xl border border-[#27272a] hover:border-[#ea580c] active:scale-95 transition-all flex flex-col items-center justify-center group relative overflow-hidden h-40 shadow-sm">
                            <div className="absolute inset-0 bg-gradient-to-t from-[#ea580c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            {p.image ? (
                              <div className="w-16 h-16 mb-3 rounded-full overflow-hidden border-2 border-[#27272a] group-hover:border-[#ea580c] transition-colors relative z-10 bg-[#09090b]">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <span className="text-5xl mb-3 group-hover:scale-110 transition-transform relative z-10">{p.emoji}</span>
                            )}
                            <span className="font-bold text-gray-200 mb-1 text-center line-clamp-1 relative z-10 text-sm">{tr(p.name)}</span>
                            <span className="text-[#ea580c] font-black relative z-10 text-sm">{p.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-[400px] bg-[#18181b] border-l border-[#27272a] flex flex-col h-[50vh] lg:h-full z-20 absolute bottom-0 lg:relative rounded-t-3xl lg:rounded-none">
                    <div className="p-4 md:p-6 border-b border-[#27272a] shrink-0">
                      <div className="w-12 h-1.5 bg-[#27272a] rounded-full mx-auto mb-4 lg:hidden"></div>
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-black text-white uppercase">{t.currentOrder}</h2>
                        <span className="text-xs bg-[#27272a] text-gray-400 px-3 py-1 rounded-full font-bold">{activeTable.replace("Table", t.Table || "Table")}</span>
                      </div>
                      <div className="flex bg-[#09090b] rounded-xl p-1 border border-[#27272a]">
                        <button onClick={() => {setOrderType(t.dineIn); playBeep();}} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${orderType === t.dineIn ? "bg-[#27272a] text-[#ea580c]" : "text-gray-500 hover:text-gray-300"}`}>{t.dineIn}</button>
                        <button onClick={() => {setOrderType(t.takeAway); playBeep();}} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${orderType === t.takeAway ? "bg-[#27272a] text-[#ea580c]" : "text-gray-500 hover:text-gray-300"}`}>{t.takeAway}</button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar">
                      {cart.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600"><span className="text-5xl mb-3 opacity-30">🛒</span><p className="font-bold">{t.empty}</p></div>
                      ) : (
                        cart.map(item => (
                          <div key={item.id} className="flex justify-between items-center mb-3 bg-[#09090b] p-4 rounded-xl border border-[#27272a]">
                            <div className="flex-1 pr-2"><h4 className="font-bold text-white text-sm line-clamp-1">{tr(item.name)}</h4><p className="text-xs font-bold text-[#ea580c] mt-1">{item.price}</p></div>
                            <div className="flex items-center gap-2 bg-[#18181b] rounded-lg p-1.5 border border-[#27272a]">
                              <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 hover:bg-[#27272a] hover:text-white rounded-md transition-colors">-</button>
                              <span className="font-bold w-5 text-center text-sm text-white">{item.qty}</span>
                              <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center font-bold text-gray-400 hover:text-[#ea580c] hover:bg-[#27272a] rounded-md transition-colors">+</button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="p-4 md:p-6 bg-[#09090b] border-t border-[#27272a] shrink-0">
                      <div className="mb-4">
                        <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">{t.payMeth}</label>
                        <div className="flex flex-wrap gap-2">
                          {PAYMENT_METHODS.map(pm => (
                            <button key={pm} onClick={() => {setPaymentMethod(pm); playBeep();}} className={`flex-1 min-w-[30%] py-2 px-1 rounded-lg text-xs font-bold transition-all border ${paymentMethod === pm ? "bg-[#ea580c] border-[#ea580c] text-white" : "bg-[#18181b] border-[#27272a] text-gray-400 hover:text-white hover:bg-[#27272a]"}`}>
                              {payTrans[pm]}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-between text-gray-400 text-sm font-medium mb-2"><span>{t.subtotal}:</span><span>{subtotal}</span></div>
                      <div className="flex justify-between text-gray-400 text-sm font-medium mb-3"><span>{t.tax} ({taxRate}%):</span><span>{taxAmount}</span></div>
                      <div className="flex justify-between font-black text-3xl mb-4 text-white pt-3 border-t border-[#27272a]"><span>{t.total}</span><span className="text-[#ea580c]">{total} <span className="text-sm font-medium text-gray-500">{currency}</span></span></div>
                      <button onClick={handleCheckout} disabled={cart.length === 0 || !shift.isOpen} className={`w-full font-bold py-4 rounded-xl transition-all uppercase tracking-widest ${cart.length > 0 && shift.isOpen ? "bg-[#ea580c] text-white hover:bg-[#c2410c] shadow-[0_0_20px_rgba(234,88,12,0.3)] active:scale-[0.98]" : "bg-[#27272a] text-gray-600 cursor-not-allowed"}`}>{t.pay}</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeModule === "products" && (
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-[#18181b] rounded-2xl p-6 border border-[#27272a]">
                    <h3 className="font-bold text-[#ea580c] mb-4">{t.addCat}</h3>
                    <form onSubmit={handleAddCat} className="flex gap-2 mb-4">
                      <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} placeholder="e.g. Salads" className="flex-1 bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-2 outline-none text-white focus:border-[#ea580c]" required />
                      <button type="submit" className="bg-[#ea580c] text-white font-bold px-4 py-2 rounded-lg">{t.save}</button>
                    </form>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(c => (
                        <div key={c} className="bg-[#27272a] text-gray-300 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-2">{tr(c)} <button onClick={() => {setCategories(categories.filter(x=>x!==c)); playBeep();}} className="text-red-400 hover:text-red-500">×</button></div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2 bg-[#18181b] rounded-2xl p-6 border border-[#27272a]">
                    <h3 className="font-bold text-[#ea580c] mb-4">{t.addProd}</h3>
                    <form onSubmit={handleAddProd} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <div className="sm:col-span-2"><input type="text" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} placeholder={t.name} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-3 outline-none text-white focus:border-[#ea580c]" required /></div>
                      <div><input type="number" value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} placeholder={t.price} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-3 outline-none text-white focus:border-[#ea580c]" required /></div>
                      <div><select value={newProdCat} onChange={(e) => setNewProdCat(e.target.value)} className="w-full bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-3 outline-none text-white focus:border-[#ea580c]">{categories.map(c => <option key={c} value={c}>{tr(c)}</option>)}</select></div>
                      
                      <div className="sm:col-span-4 flex items-center gap-4 bg-[#09090b] border border-[#27272a] rounded-lg px-4 py-2">
                        <label className="text-gray-400 font-bold text-sm whitespace-nowrap">{t.imageOpt}:</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-400 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#27272a] file:text-white hover:file:bg-[#3f3f46] cursor-pointer" />
                        {newProdImage && <img src={newProdImage} className="w-10 h-10 rounded-md object-cover border border-[#ea580c]" />}
                      </div>

                      <div className="sm:col-span-4"><button type="submit" className="w-full bg-[#ea580c] text-white font-bold px-8 py-3 rounded-lg hover:bg-[#c2410c] transition mt-2">{t.addProd}</button></div>
                    </form>
                  </div>
                </div>

                <div className="bg-[#18181b] rounded-2xl border border-[#27272a] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#09090b] text-gray-500 border-b border-[#27272a]"><tr><th className="p-4">{t.name}</th><th className="p-4">{t.cat}</th><th className="p-4">{t.price}</th><th className="p-4 text-right">{t.action}</th></tr></thead>
                      <tbody className="divide-y divide-[#27272a]">
                        {products.map(p => (
                          <tr key={p.id} className="hover:bg-[#27272a]/50">
                            <td className="p-4 font-bold text-white flex items-center gap-3">
                              {p.image ? <img src={p.image} className="w-8 h-8 rounded-full object-cover border border-[#27272a]" /> : <span>{p.emoji}</span>}
                              {tr(p.name)}
                            </td>
                            <td className="p-4 text-gray-400">{tr(p.category)}</td><td className="p-4 text-[#ea580c] font-bold">{p.price} {currency}</td>
                            <td className="p-4 text-right"><button onClick={() => {setProducts(products.filter(x=>x.id!==p.id)); playBeep();}} className="text-red-500 font-bold bg-red-500/10 px-3 py-1.5 rounded-lg">{t.del}</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeModule === "customers" && (
             <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              <div className="max-w-6xl mx-auto space-y-6">
                <div className="bg-[#18181b] rounded-2xl p-6 border border-[#27272a]">
                  <h3 className="font-bold text-[#ea580c] mb-4">{t.addCust}</h3>
                  <form onSubmit={handleAddCust} className="flex gap-4">
                    <input type="text" value={newCustName} onChange={(e)=>setNewCustName(e.target.value)} placeholder={t.custName} className="flex-1 bg-[#09090b] border border-[#27272a] rounded-lg p-3 text-white outline-none focus:border-[#ea580c]" required/>
                    <input type="text" value={newCustPhone} onChange={(e)=>setNewCustPhone(e.target.value)} placeholder={t.phone} className="flex-1 bg-[#09090b] border border-[#27272a] rounded-lg p-3 text-white outline-none focus:border-[#ea580c]"/>
                    <button type="submit" className="bg-[#ea580c] text-white font-bold px-6 rounded-lg">{t.save}</button>
                  </form>
                </div>
                <div className="bg-[#18181b] rounded-2xl border border-[#27272a] overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#09090b] text-gray-500 border-b border-[#27272a]"><tr><th className="p-4">{t.name}</th><th className="p-4">{t.phone}</th><th className="p-4">{t.points}</th></tr></thead>
                    <tbody className="divide-y divide-[#27272a]">
                      {customers.map(c => <tr key={c.id} className="hover:bg-[#27272a]/50"><td className="p-4 font-bold text-white">{c.name}</td><td className="p-4 text-gray-400">{c.phone}</td><td className="p-4 text-[#ea580c] font-bold">{c.points} pts</td></tr>)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {activeModule === "shift" && (
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              <div className="max-w-xl mx-auto bg-[#18181b] rounded-3xl p-8 border border-[#27272a] shadow-2xl">
                <h3 className="text-2xl font-black text-white mb-8 border-b border-[#27272a] pb-4">{t.shift}</h3>
                {!shift.isOpen ? (
                  <div className="space-y-6">
                    <div className="bg-[#09090b] p-6 rounded-2xl border border-[#27272a]">
                      <label className="text-xs font-bold text-gray-500 uppercase block mb-3">{t.openFloat}</label>
                      <input type="number" value={openInput} onChange={(e) => setOpenInput(e.target.value)} placeholder="0" className="w-full bg-transparent text-4xl font-black text-white outline-none" />
                    </div>
                    <button onClick={handleOpenShift} className="w-full bg-[#ea580c] text-white font-bold py-4 rounded-xl hover:bg-[#c2410c] text-lg uppercase tracking-wider">{t.openShift}</button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#09090b] p-4 rounded-xl border border-[#27272a]"><span className="block text-xs font-bold text-gray-500 uppercase">{t.opening}</span><span className="text-xl font-bold text-gray-300">{shift.openingCash}</span></div>
                      <div className="bg-[#ea580c]/10 p-4 rounded-xl border border-[#ea580c]/30"><span className="block text-xs font-bold text-[#ea580c] uppercase">{t.sales}</span><span className="text-xl font-bold text-[#ea580c]">+{shift.sales}</span></div>
                    </div>
                    <div className="border border-[#27272a] p-6 rounded-xl bg-[#09090b]">
                      <label className="text-xs font-bold text-gray-500 uppercase block mb-3">{t.actualCash}</label>
                      <input type="number" value={actualCash} onChange={(e) => setActualCash(e.target.value)} placeholder={t.enterCash} className="w-full bg-transparent text-2xl font-bold text-white outline-none border-b border-[#27272a] pb-2" />
                    </div>
                    <button onClick={handleCloseShift} className="w-full bg-[#ef4444] text-white font-bold py-4 rounded-xl hover:bg-[#dc2626] text-lg uppercase tracking-wider">{t.closeShift}</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeModule === "reports" && (
             <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              <div className="max-w-6xl mx-auto space-y-6">
                
                {shift.isOpen && (
                  <div className="mb-10">
                    <h4 className="font-black text-xl text-[#ea580c] mb-4">{t.salesBreak} <span className="text-sm font-medium text-gray-500">({t.shiftActive})</span></h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                      {PAYMENT_METHODS.map(pm => (
                        <div key={pm} className="bg-[#18181b] p-5 rounded-2xl border border-[#27272a] shadow-lg">
                          <span className="block text-[10px] font-bold text-gray-500 uppercase mb-1">{payTrans[pm]}</span>
                          <span className="text-2xl font-black text-white">{shift.salesByMethod[pm] || 0} <span className="text-xs font-medium text-[#ea580c]">{currency}</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <h3 className="font-black text-2xl text-white mb-6">{t.shiftHist}</h3>
                
                <div className="bg-[#18181b] rounded-2xl border border-[#27272a] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-[#09090b] text-gray-500 border-b border-[#27272a]">
                        <tr>
                          <th className="p-4">{t.date}</th>
                          <th className="p-4">{t.cash}</th>
                          <th className="p-4">{t.ewallet}</th>
                          <th className="p-4">{t.debit}</th>
                          <th className="p-4">{t.credit}</th>
                          <th className="p-4">{t.onlineDel}</th>
                          <th className="p-4">{t.expected}</th>
                          <th className="p-4">{t.actual}</th>
                          <th className="p-4">{t.diff}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#27272a]">
                        {shiftHistory.length === 0 && <tr><td colSpan={9} className="p-8 text-center text-gray-600">{t.noRep}</td></tr>}
                        {shiftHistory.map((s, i) => (
                          <tr key={i} className="hover:bg-[#27272a]/50">
                            <td className="p-4 text-gray-300">{s.date}</td>
                            <td className="p-4 text-white font-medium">{s.salesByMethod?.["Cash"] || 0}</td>
                            <td className="p-4 text-white font-medium">{s.salesByMethod?.["E-Wallet"] || 0}</td>
                            <td className="p-4 text-white font-medium">{s.salesByMethod?.["Debit Card"] || 0}</td>
                            <td className="p-4 text-white font-medium">{s.salesByMethod?.["Credit Card"] || 0}</td>
                            <td className="p-4 text-white font-medium">{s.salesByMethod?.["Online Delivery"] || 0}</td>
                            <td className="p-4 text-[#ea580c] font-bold">{s.expected}</td>
                            <td className="p-4 text-white">{s.actual}</td>
                            <td className={`p-4 font-black ${s.diff < 0 ? 'text-red-500' : 'text-green-500'}`}>{s.diff}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeModule === "settings" && (
            <div className="flex-1 p-6 md:p-8 overflow-y-auto">
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="bg-[#18181b] rounded-2xl p-6 border border-[#27272a]">
                  <h3 className="font-bold text-[#ea580c] mb-6">{t.storeProf}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <label className="font-bold text-gray-400">{t.storeNameTxt}</label>
                    <input type="text" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="bg-[#09090b] border border-[#27272a] rounded-lg p-3 text-white outline-none w-64 text-right focus:border-[#ea580c]" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <label className="font-bold text-gray-400">{t.currText}</label>
                    <input type="text" value={currency} onChange={(e) => handleSaveCurrency(e.target.value)} placeholder="e.g. MMK, USD, THB" className="bg-[#09090b] border border-[#27272a] rounded-lg p-3 text-white outline-none w-32 text-center focus:border-[#ea580c] font-bold text-[#ea580c]" />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="font-bold text-gray-400">{t.taxRateTxt}</label>
                    <input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} className="bg-[#09090b] border border-[#27272a] rounded-lg p-3 text-white outline-none w-32 text-right focus:border-[#ea580c]" />
                  </div>
                </div>
                <div className="bg-[#18181b] rounded-2xl p-6 border border-[#27272a]">
                  <h3 className="font-bold text-[#ea580c] mb-6">{t.sysToggles}</h3>
                  <div className="flex items-center justify-between p-3 border-b border-[#27272a]"><span className="font-bold text-gray-300">{t.enableSound}</span><div onClick={() => setPrefAudio(!prefAudio)} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all ${prefAudio ? 'bg-[#ea580c]' : 'bg-[#27272a]'}`}><div className={`bg-white w-4 h-4 rounded-full transition-transform ${prefAudio ? 'translate-x-6' : 'translate-x-0'}`}></div></div></div>
                </div>
              </div>
            </div>
          )}

          {activeModule === "billing" && (
            <div className="flex-1 p-6 md:p-10 overflow-y-auto">
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-black text-white mb-3">{t.currPlan}</h2>
                  <p className="text-gray-400">{t.allFeat}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-8 hover:border-[#ea580c] transition-all flex flex-col relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ea580c] rounded-full mix-blend-multiply filter blur-3xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <h4 className="text-xl font-bold text-gray-300 mb-2 uppercase tracking-wider">{t.sixMonths}</h4>
                    <div className="text-5xl font-black text-white mb-8">$100</div>
                    <ul className="text-gray-400 space-y-4 mb-8 flex-1 font-medium">
                       <li className="flex items-center gap-3"><span className="text-[#ea580c]">✓</span> {t.allFeat}</li>
                       <li className="flex items-center gap-3"><span className="text-[#ea580c]">✓</span> 6 Months of Full Access</li>
                       <li className="flex items-center gap-3"><span className="text-[#ea580c]">✓</span> Premium Support</li>
                    </ul>
                    <button onClick={() => handleSubscribe(t.sixMonths)} className="w-full bg-[#27272a] hover:bg-[#ea580c] text-white font-bold py-4 rounded-xl transition-colors tracking-widest uppercase">{t.subscribe}</button>
                  </div>

                  <div className="bg-gradient-to-br from-[#ea580c] to-[#c2410c] border border-[#ea580c] rounded-3xl p-8 transition-all flex flex-col relative overflow-hidden shadow-[0_0_30px_rgba(234,88,12,0.25)] hover:shadow-[0_0_40px_rgba(234,88,12,0.4)] hover:-translate-y-1">
                    <div className="absolute top-0 right-0 bg-white text-[#ea580c] font-black text-[10px] px-4 py-1.5 rounded-bl-xl uppercase tracking-widest">{t.bestValue}</div>
                    <h4 className="text-xl font-bold text-[#ffedd5] mb-2 uppercase tracking-wider">{t.oneYear}</h4>
                    <div className="text-5xl font-black text-white mb-8">$200</div>
                    <ul className="text-white space-y-4 mb-8 flex-1 font-medium">
                       <li className="flex items-center gap-3"><span className="text-[#ffedd5]">✓</span> {t.allFeat}</li>
                       <li className="flex items-center gap-3"><span className="text-[#ffedd5]">✓</span> 1 Full Year of Access</li>
                       <li className="flex items-center gap-3"><span className="text-[#ffedd5]">✓</span> 24/7 Priority Support</li>
                    </ul>
                    <button onClick={() => handleSubscribe(t.oneYear)} className="w-full bg-white text-[#ea580c] hover:bg-gray-100 font-black py-4 rounded-xl transition-colors tracking-widest uppercase">{t.subscribe}</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
