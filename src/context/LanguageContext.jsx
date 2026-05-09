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
    heroTitlePart1: "Dress",
    heroTitlePart2: "Different.",
    heroTitlePart3: "Stay",
    heroTitlePart4: "M You.",
    heroSubtitle: "Premium Handpicked quality, unmatched aesthetic.",
    shopNewDrops: "Shop New Drops",
    heroTitle: "Discover Your Vibe",
    shopNow: "Shop Now",
    featuredProducts: "Featured Products",
    newArrivals: "New Arrivals",
    specialOffers: "Special Offers",
    limitedTime: "Limited Time Only",
    shopBy: "Shop by",
    viewAll: "View All",

    // Products
    shopAll: "Shop All",
    showing: "Showing",
    resultsText: "results",
    categoriesText: "categories",
    categories: "Categories",
    all: "All",
    filters: "Filters",
    clearAll: "Clear all",
    size: "Size",
    maxPrice: "Max Price",
    egp: "EGP",
    priceRange: "Price Range",
    applyFilters: "Apply Filters",

    // Product Detail
    quickAdd: "Quick Add",
    sale: "Sale",
    featured: "Featured",
    addToCart: "Add to Cart",
    addedToCart: "Added to Cart! ✓",
    selectSizeError: "Please select a size before adding to cart.",
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
    itemsTitle: "items",
    product: "Product",
    quantity: "Quantity",
    total: "Total",
    remove: "Remove",
    orderSummary: "Order Summary",
    checkoutBtn: "Proceed to Checkout",
    yourCart: "Your Cart",
    shoppingCart: "Shopping Cart",
    cartEmptyMsg: "Your cart is empty",
    notAddedAnything: "Looks like you haven't added anything yet.",
    startShopping: "Start Shopping",
    sizeLabel: "Size:",
    emptyCart: "Your cart is empty.",
    continueShopping: "Continue Shopping",
    subtotal: "Subtotal",
    taxesShipping: "Taxes & shipping calculated at checkout",
    viewCart: "View Cart",
    proceedToCheckout: "Proceed to Checkout",
    checkout: "Checkout",
    shipping: "Shipping",
    calcCheckout: "Calculated at checkout",
    taxes: "Taxes",
    included: "Included",
    estimatedTotal: "Estimated Total",
    secureCheckout: "Secure Checkout",

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
    deliveryFee: "Delivery Fee",
    totalInfo: "Total",
    placeOrder: "Place Order",
    processing: "Processing...",
    validPhoneReq: "Valid phone number is required (11 digits)",
    govReq: "Governorate is required",
    addrReq: "Address is required",
    fullNameReq: "Full name is required",
    invalidCode: "Invalid or expired discount code.",
    errorVerifyCode: "Error verifying discount code.",
    cashOnDel: "Cash on Delivery",
    vodaCash: "Vodafone Cash",
    promoCode: "Promo Code",
    discount: "Discount",
    selectGov: "Select governorate",
    govLabel: "Governorate *",
    addressLabel: "Address *",
    agreeTerms: "By placing your order, you agree to our terms of service.",

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
    heroTitlePart1: "البس",
    heroTitlePart2: "مختلف.",
    heroTitlePart3: "خليك",
    heroTitlePart4: "إم يو.",
    heroSubtitle: "جودة ممتازة مختارة بعناية ومظهر لا مثيل له.",
    shopNewDrops: "تسوق أحدث المنتجات",
    heroTitle: "اكتشف أسلوبك",
    shopNow: "تسوق الآن",
    featuredProducts: "منتجات مميزة",
    newArrivals: "وصل حديثاً",
    specialOffers: "عروض خاصة",
    limitedTime: "لفترة محدودة فقط",
    shopBy: "تسوّق حسب",
    viewAll: "عرض الكل",

    // Products
    shopAll: "تسوّق الكل",
    showing: "عرض",
    resultsText: "نتائج",
    categoriesText: "فئات",
    categories: "الفئات",
    all: "الكل",
    filters: "الفلاتر",
    clearAll: "مسح الكل",
    size: "المقاس",
    maxPrice: "الحد الأقصى للسعر",
    egp: "جنيه",
    priceRange: "نطاق السعر",
    applyFilters: "تطبيق الفلاتر",

    // Product Detail
    quickAdd: "إضافة سريعة",
    sale: "تخفيض",
    featured: "مميز",
    addToCart: "أضف إلى العربة",
    addedToCart: "تمت الإضافة ✓",
    selectSizeError: "الرجاء اختيار المقاس أولاً.",
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
    itemsTitle: "عناصر",
    product: "المنتج",
    quantity: "الكمية",
    total: "المجموع",
    remove: "إزالة",
    orderSummary: "ملخص الطلب",
    checkoutBtn: "المتابعة لإتمام الطلب",
    yourCart: "عربة التسوق",
    shoppingCart: "عربة التسوق",
    cartEmptyMsg: "عربتك فارغة",
    notAddedAnything: "يبدو أنك لم تضف شيئاً بعد.",
    startShopping: "ابدأ التسوق",
    sizeLabel: "المقاس:",
    emptyCart: "عربة التسوق فارغة.",
    continueShopping: "مواصلة التسوق",
    subtotal: "المجموع الفرعي",
    taxesShipping: "يتم حساب الضرائب والشحن عند الدفع",
    viewCart: "عرض العربة",
    proceedToCheckout: "المتابعة لإتمام الطلب",
    checkout: "إتمام الطلب",
    shipping: "الشحن",
    calcCheckout: "يتم حسابه عند الدفع",
    taxes: "الضرائب",
    included: "متضمنة",
    estimatedTotal: "المجموع المقدر",
    secureCheckout: "دفع آمن",

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
    deliveryFee: "رسوم التوصيل",
    totalInfo: "الإجمالي",
    placeOrder: "تأكيد الطلب",
    processing: "جاري المعالجة...",
    validPhoneReq: "مطلوب رقم هاتف صحيح (11 رقم)",
    govReq: "مطلوب اختيار المحافظة",
    addrReq: "مطلوب كتابة العنوان",
    fullNameReq: "الاسم الكامل مطلوب",
    invalidCode: "كود الخصم غير صحيح أو منتهي الصلاحية.",
    errorVerifyCode: "خطأ في التحقق من كود الخصم.",
    cashOnDel: "الدفع عند الاستلام",
    vodaCash: "فودافون كاش",
    promoCode: "كود الخصم",
    discount: "خصم",
    selectGov: "اختر المحافظة",
    govLabel: "المحافظة *",
    addressLabel: "العنوان *",
    agreeTerms: "بإتمامك للطلب، أنت توافق على شروط الخدمة.",

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
