import { createContext, useContext, useState, useEffect } from "react";

const translations = {
  en: {
    // Navbar
    home: "Home",
    shop: "Shop",
    cart: "Cart",
    trackOrder: "Track Order",
    admin: "Admin",
    language: "AR",

    // Home
    heroTitle: "Discover Your Vibe",
    heroSubtitle: "Shop the latest trends with Gen Z's favorite styles.",
    shopNow: "Shop Now",
    featuredProducts: "Featured Products",
    newArrivals: "New Arrivals",
    specialOffers: "Special Offers",
    viewAll: "View All",

    // Products
    categories: "Categories",
    all: "All",
    filters: "Filters",
    priceRange: "Price Range",
    applyFilters: "Apply Filters",

    // Product Detail
    addToCart: "Add to Cart",
    outOfStock: "Out of Stock",
    buyNow: "Buy it Now",
    selectSize: "Select Size",
    sizeGuide: "Size Guide",
    material: "Material",
    category: "Category",
    itemsAvailable: "items available",
    currentlyOut: "Currently out of stock",
    fastDelivery: "Fast Delivery",
    fastDeliveryDesc: "2-3 days in Cairo, 3-4 days in Alex.",

    // Cart
    yourCart: "Your Cart",
    emptyCart: "Your cart is empty.",
    continueShopping: "Continue Shopping",
    subtotal: "Subtotal",
    checkout: "Checkout",

    // Checkout
    checkoutTitle: "Checkout",
    contactInfo: "Contact & Delivery",
    fullName: "Full Name",
    phone: "Phone Number",
    governorate: "Governorate",
    address: "Detailed Address",
    paymentMethod: "Payment Method",
    cashOnDelivery: "Cash on Delivery",
    instapay: "InstaPay",
    vodafoneCash: "Vodafone Cash",
    uploadScreenshot: "Upload Receipt Screenshot",
    orderNotes: "Order Notes (Optional)",
    discountCode: "Discount Code",
    apply: "Apply",
    remove: "Remove",
    deliveryFee: "Delivery Fee",
    total: "Total",
    placeOrder: "Place Order",
    processing: "Processing...",

    // Track Order
    trackOrderTitle: "Track Your Order",
    orderIdPlaceholder: "Enter your Order ID",
    track: "Track",
    orderStatus: "Status",
    statusPending: "🟡 Pending",
    statusConfirmed: "🔵 Confirmed",
    statusDelivered: "🟢 Delivered",
    statusCancelled: "🔴 Cancelled",
    orderItems: "Items",
    orderTotal: "Total",
    orderDate: "Date",
  },
  ar: {
    // Navbar
    home: "الرئيسية",
    shop: "المتجر",
    cart: "العربة",
    trackOrder: "تتبع الطلب",
    admin: "لوحة التحكم",
    language: "EN",

    // Home
    heroTitle: "اكتشف أسلوبك",
    heroSubtitle: "تسوق أحدث صيحات الموضة.",
    shopNow: "تسوق الآن",
    featuredProducts: "منتجات مميزة",
    newArrivals: "وصل حديثاً",
    specialOffers: "عروض خاصة",
    viewAll: "عرض الكل",

    // Products
    categories: "الفئات",
    all: "الكل",
    filters: "الفلاتر",
    priceRange: "نطاق السعر",
    applyFilters: "تطبيق الفلاتر",

    // Product Detail
    addToCart: "أضف إلى العربة",
    outOfStock: "نفدت الكمية",
    buyNow: "اشتري الآن",
    selectSize: "اختر المقاس",
    sizeGuide: "دليل المقاسات",
    material: "المادة",
    category: "الفئة",
    itemsAvailable: "قطعة متاحة",
    currentlyOut: "غير متوفر حالياً",
    fastDelivery: "توصيل سريع",
    fastDeliveryDesc: "2-3 أيام في القاهرة، 3-4 في الإسكندرية.",

    // Cart
    yourCart: "عربة التسوق",
    emptyCart: "عربة التسوق فارغة.",
    continueShopping: "مواصلة التسوق",
    subtotal: "المجموع الفرعي",
    checkout: "إتمام الطلب",

    // Checkout
    checkoutTitle: "إتمام الطلب",
    contactInfo: "معلومات الاتصال والتوصيل",
    fullName: "الاسم الكامل",
    phone: "رقم الهاتف",
    governorate: "المحافظة",
    address: "العنوان بالتفصيل",
    paymentMethod: "طريقة الدفع",
    cashOnDelivery: "الدفع عند الاستلام",
    instapay: "إنستاباي",
    vodafoneCash: "فودافون كاش",
    uploadScreenshot: "إرفاق صورة الإيصال",
    orderNotes: "ملاحظات الطلب (اختياري)",
    discountCode: "كود الخصم",
    apply: "تطبيق",
    remove: "إزالة",
    deliveryFee: "رسوم التوصيل",
    total: "الإجمالي",
    placeOrder: "تأكيد الطلب",
    processing: "جاري المعالجة...",

    // Track Order
    trackOrderTitle: "تتبع طلبك",
    orderIdPlaceholder: "أدخل رقم الطلب",
    track: "تتبع",
    orderStatus: "الحالة",
    statusPending: "🟡 قيد الانتظار",
    statusConfirmed: "🔵 تم التأكيد",
    statusDelivered: "🟢 تم التوصيل",
    statusCancelled: "🔴 ملغي",
    orderItems: "العناصر",
    orderTotal: "المجموع",
    orderDate: "التاريخ",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem("myou_lang") || "en";
  });

  useEffect(() => {
    localStorage.setItem("myou_lang", lang);
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "ar" : "en"));
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
