import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

import { useLanguage } from "../context/LanguageContext.jsx";

const WHATSAPP_NUMBER = "201070831335";

const GOVERNORATES = [
  "Cairo",
  "Giza",
  "Alexandria",
  "Dakahlia",
  "Red Sea",
  "Beheira",
  "Fayoum",
  "Gharbia",
  "Ismailia",
  "Menofia",
  "Minya",
  "Qalyubia",
  "New Valley",
  "North Sinai",
  "Port Said",
  "Damietta",
  "Sharqia",
  "South Sinai",
  "Suez",
  "Luxor",
  "Matrouh",
  "Qena",
  "Sohag",
  "Aswan",
  "Assiut",
  "Beni Suef",
];

const GOV_FEES = {
  Cairo: 100,
  Giza: 100,
  Alexandria: 100,
  Dakahlia: 100,
  Beheira: 100,
  Gharbia: 100,
  Menofia: 100,
  Qalyubia: 100,
  Damietta: 100,
  Sharqia: 100,
  Ismailia: 100,
  Suez: 100,
  "Port Said": 100,
  Fayoum: 100,
  "Beni Suef": 100,
  Minya: 100,
  Assiut: 100,
  Sohag: 100,
  Qena: 100,
  Luxor: 100,
  Aswan: 100,
  "Red Sea": 100,
  "New Valley": 100,
  "North Sinai": 100,
  "South Sinai": 100,
  Matrouh: 100,
};

export default function Checkout() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { items, cartTotal, clearCart } = useCart();

  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get("orderId");

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    governorate: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showReturnPolicy, setShowReturnPolicy] = useState(false);
  const [hasCopiedVodafone, setHasCopiedVodafone] = useState(false);
  const [hasCopiedInstapay, setHasCopiedInstapay] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [discountError, setDiscountError] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Protect route
  useEffect(() => {
    if (items.length === 0 && !submitted) navigate("/cart", { replace: true });
  }, [items, navigate, submitted]);

  const [dbFees, setDbFees] = useState({});

  useEffect(() => {
    fetch("/api/delivery_fees")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const feesMap = {};
          data.forEach((item) => {
            feesMap[item.governorate] = item.fee;
          });
          setDbFees(feesMap);
        }
      })
      .catch((err) => console.error("Failed to load DB fees", err));
  }, []);

  if (items.length === 0 && !submitted) return null;

  const total = cartTotal;
  const discountValue = appliedDiscount
    ? total * (appliedDiscount.discountPercent / 100)
    : 0;
  const totalAfterDiscount = total - discountValue;
  const deliveryFee = form.governorate
    ? dbFees[form.governorate] !== undefined
      ? dbFees[form.governorate]
      : 100
    : 0;
  const finalTotal = totalAfterDiscount + deliveryFee;

  const handleApplyDiscount = async () => {
    setIsApplying(true);
    setDiscountError("");
    try {
      const res = await fetch("/api/discounts");
      const discounts = await res.json();
      const validDiscount = discounts.find(
        (d) =>
          d.code && d.code.toLowerCase() === discountCode.trim().toLowerCase(),
      );

      if (validDiscount) {
        setAppliedDiscount(validDiscount);
      } else {
        setDiscountError(
          t("invalidCode") || "Invalid or expired discount code.",
        );
        setAppliedDiscount(null);
      }
    } catch (err) {
      setDiscountError(
        t("errorVerifyCode") || "Error verifying discount code.",
      );
    } finally {
      setIsApplying(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError("");
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = t("fullNameReq");
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length !== 11)
      errs.phone = t("validPhoneReq");
    if (!form.governorate) errs.governorate = t("govReq");
    if (!form.address.trim()) errs.address = t("addrReq");
    return errs;
  };

  const buildWhatsAppMessage = () => {
    const itemLines = items
      .map(
        (item) =>
          `• ${item.product.name} | Size: ${item.size} ${item.color ? `| Color: ${item.color} ` : ""}| Qty: ${item.qty} | Price: ${item.product.price}\nLink: ${window.location.origin}/products/${item.product._id}`,
      )
      .join("\n\n");

    const govLabel = form.governorate;
    const payment =
      paymentMethod === "cash"
        ? "Cash on Delivery"
        : paymentMethod === "instapay"
          ? "Instapay"
          : "Vodafone Cash";

    let msgStr = `*New Order from ${form.fullName}*\n\n`;
    let body =
      msgStr +
      `*Contact:*\n📞 ${form.phone}\n\n` +
      `*Address:*\n📍 ${govLabel}\n🏠 ${form.address}\n\n` +
      `📦 *Order Items*\n${itemLines}\n\n` +
      `💰 *Subtotal: LE ${total.toFixed(2)}*\n`;

    if (appliedDiscount) {
      body += `🏷️ *Discount (${appliedDiscount.code} - ${appliedDiscount.discountPercent}%): -LE ${discountValue.toFixed(2)}*\n`;
    }

    body +=
      `🚚 *Delivery Fee: LE ${deliveryFee.toFixed(2)}*\n` +
      `💰 *Total: LE ${finalTotal.toFixed(2)}*\n` +
      `💳 *Payment Method:* ${payment}`;

    return body;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    const message = buildWhatsAppMessage();
    const encoded = encodeURIComponent(message);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    window.open(waUrl, "_blank");

    // Save order to backend API
    try {
      const orderItems = items.map((item) => ({
        productId: item.product._id,
        name: item.product.name,
        size: item.size,
        color: item.color,
        qty: item.qty,
        price: item.product.price,
        image: item.product.images?.[0] || "",
      }));

      await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: form.fullName,
          phone: form.phone,
          city: form.governorate,
          address: form.address,
          items: orderItems,
          total: finalTotal,
          paymentMethod:
            paymentMethod === "cash"
              ? "cash_on_delivery"
              : paymentMethod === "instapay"
                ? "instapay"
                : "vodafone_cash",
          notes: appliedDiscount
            ? `Discount Applied: ${appliedDiscount.code} (-${appliedDiscount.discountPercent}%)`
            : "",
        }),
      });
    } catch (err) {
      console.error("Failed to save order to API:", err);
    }

    setSubmitted(true);
    clearCart();

    setTimeout(() => {
      navigate("/");
    }, 4000);
  };

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  if (submitted) {
    return (
      <div
        className="checkout-success"
        style={{ textAlign: "center", padding: "6rem 1rem" }}
      >
        <div className="checkout-success-card">
          <div
            className="checkout-success-icon"
            style={{
              fontSize: "3rem",
              color: "var(--success)",
              marginBottom: "1rem",
            }}
          >
            ✓
          </div>
          <h2 style={{ marginBottom: "0.5rem" }}>Order Placed!</h2>
          <p style={{ color: "var(--text-muted)" }}>
            Thank you! You have been redirected to WhatsApp to complete your
            order.
          </p>
          <span
            style={{ display: "block", marginTop: "1rem", fontSize: "0.9rem" }}
          >
            Redirecting you to the home page…
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <div className="checkout-grid">
        {/* ── LEFT COLUMN: Form ── */}
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <h1
            className="checkout-heading"
            style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "2rem" }}
          >
            Checkout
          </h1>

          {/* Shipping Address */}
          <section className="form-section">
            <h3
              className="form-section-title"
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                marginBottom: "1.5rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Shipping Address
            </h3>

            <div className="checkout-form-row">
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="form-input"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "var(--radius-sm)",
                    border: errors.fullName
                      ? "1px solid var(--error)"
                      : "1px solid var(--border)",
                    background: "var(--bg-elevated)",
                    color: "var(--text)",
                  }}
                  value={form.fullName}
                  onChange={handleChange("fullName")}
                />
                {errors.fullName && (
                  <span
                    style={{
                      color: "var(--error)",
                      fontSize: "0.8rem",
                      marginTop: "0.25rem",
                      display: "block",
                    }}
                  >
                    {errors.fullName}
                  </span>
                )}
              </div>

              <div style={{ flex: 1 }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                >
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className="form-input"
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "var(--radius-sm)",
                    border: errors.phone
                      ? "1px solid var(--error)"
                      : "1px solid var(--border)",
                    background: "var(--bg-elevated)",
                    color: "var(--text)",
                  }}
                  value={form.phone}
                  onChange={handleChange("phone")}
                />
                {errors.phone && (
                  <span
                    style={{
                      color: "var(--error)",
                      fontSize: "0.8rem",
                      marginTop: "0.25rem",
                      display: "block",
                    }}
                  >
                    {errors.phone}
                  </span>
                )}
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                Governorate *
              </label>
              <select
                className="form-input"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "var(--radius-sm)",
                  border: errors.governorate
                    ? "1px solid var(--error)"
                    : "1px solid var(--border)",
                  background: "var(--bg-elevated)",
                  color: "var(--text)",
                }}
                value={form.governorate}
                onChange={handleChange("governorate")}
              >
                <option value="">Select governorate</option>
                {GOVERNORATES.map((g, i) => (
                  <option key={i} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              {errors.governorate && (
                <span
                  style={{
                    color: "var(--error)",
                    fontSize: "0.8rem",
                    marginTop: "0.25rem",
                    display: "block",
                  }}
                >
                  {errors.governorate}
                </span>
              )}
            </div>

            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                Detailed Address *
              </label>
              <textarea
                rows={3}
                className="form-input"
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  borderRadius: "var(--radius-sm)",
                  border: errors.address
                    ? "1px solid var(--error)"
                    : "1px solid var(--border)",
                  background: "var(--bg-elevated)",
                  color: "var(--text)",
                  resize: "vertical",
                }}
                placeholder="Street, building, apartment, landmark…"
                value={form.address}
                onChange={handleChange("address")}
              />
              {errors.address && (
                <span
                  style={{
                    color: "var(--error)",
                    fontSize: "0.8rem",
                    marginTop: "0.25rem",
                    display: "block",
                  }}
                >
                  {errors.address}
                </span>
              )}
            </div>
          </section>

          {/* Payment Method */}
          <section className="form-section" style={{ marginBottom: "2.5rem" }}>
            <h3
              className="form-section-title"
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                marginBottom: "1.5rem",
                paddingBottom: "0.5rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              Payment Method
            </h3>

            <div
              className="payment-options"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1.25rem",
                  background: "var(--bg-elevated)",
                  borderRadius: "var(--radius-sm)",
                  border:
                    paymentMethod === "cash"
                      ? "2px solid var(--accent)"
                      : "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  style={{
                    accentColor: "var(--accent)",
                    margin: 0,
                    width: "18px",
                    height: "18px",
                  }}
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                <span style={{ fontWeight: 600 }}>Cash on Delivery</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1.25rem",
                  background: "var(--bg-elevated)",
                  borderRadius: "var(--radius-sm)",
                  border:
                    paymentMethod === "vodafone"
                      ? "2px solid var(--accent)"
                      : "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="vodafone"
                  style={{
                    accentColor: "var(--accent)",
                    margin: 0,
                    width: "18px",
                    height: "18px",
                  }}
                  checked={paymentMethod === "vodafone"}
                  onChange={() => {
                    setPaymentMethod("vodafone");
                    setHasCopiedVodafone(false);
                  }}
                />
                <span style={{ fontWeight: 600 }}>Vodafone Cash</span>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "1.25rem",
                  background: "var(--bg-elevated)",
                  borderRadius: "var(--radius-sm)",
                  border:
                    paymentMethod === "instapay"
                      ? "2px solid var(--accent)"
                      : "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value="instapay"
                  style={{
                    accentColor: "var(--accent)",
                    margin: 0,
                    width: "18px",
                    height: "18px",
                  }}
                  checked={paymentMethod === "instapay"}
                  onChange={() => {
                    setPaymentMethod("instapay");
                    setHasCopiedInstapay(false);
                  }}
                />
                <span style={{ fontWeight: 600 }}>Instapay</span>
              </label>
            </div>

            {/* Vodafone Cash instructions */}
            {paymentMethod === "vodafone" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  padding: "1.25rem",
                  background: "rgba(230, 0, 0, 0.1)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text)",
                }}
              >
                <p
                  style={{ lineHeight: 1.6, fontSize: "0.9rem", margin: 0 }}
                  dir="rtl"
                >
                  يرجى الضغط على الزر أدناه للدفع عبر فودافون كاش.
                  <br />
                  <strong>مهم:</strong> يجب التقاط لقطة شاشة (سكرين شوت) للتحويل
                  وإرسالها على الواتساب مع الطلب لتأكيد الدفع.
                </p>
                <a
                  href="http://vf.eg/vfcash?id=mt&qrId=9CVxWq"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setHasCopiedVodafone(true)}
                  style={{
                    backgroundColor: "#e60000",
                    color: "#fff",
                    padding: "0.8rem 1.5rem",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    alignSelf: "flex-start",
                    textDecoration: "none",
                  }}
                >
                  {hasCopiedVodafone
                    ? "تم فتح الرابط ✓"
                    : "الدفع عبر فودافون كاش"}
                </a>
              </div>
            )}

            {/* Instapay instructions */}
            {paymentMethod === "instapay" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  padding: "1.25rem",
                  background: "rgba(81, 38, 139, 0.1)",
                  borderRadius: "var(--radius-sm)",
                  color: "var(--text)",
                }}
              >
                <p
                  style={{ lineHeight: 1.6, fontSize: "0.9rem", margin: 0 }}
                  dir="rtl"
                >
                  يرجى الضغط على الزر أدناه للدفع عبر انستاباي.
                  <br />
                  <strong>مهم:</strong> يجب التقاط لقطة شاشة (سكرين شوت) للتحويل
                  وإرسالها على الواتساب مع الطلب لتأكيد الدفع.
                </p>
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setHasCopiedInstapay(true)}
                  style={{
                    backgroundColor: "#51268b",
                    color: "#fff",
                    padding: "0.8rem 1.5rem",
                    borderRadius: "8px",
                    border: "none",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    alignSelf: "flex-start",
                    textDecoration: "none",
                  }}
                >
                  {hasCopiedInstapay ? "تم فتح الرابط ✓" : "Pay with Instapay"}
                </a>
              </div>
            )}
          </section>

          <div
            style={{
              background: "rgba(255,255,255,0.05)",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
            dir="rtl"
          >
            <strong
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "var(--accent)",
              }}
            >
              ملاحظة هامة:
            </strong>
            بعد النقر على استكمال الدفع، سيتم توجيهك إلى واتساب. يجب النقر على
            إرسال لتأكيد الطلب وإرسال سكرين شوت الدفع إن وجد.
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={paymentMethod === "vodafone" && !hasCopiedVodafone}
            style={{
              opacity:
                paymentMethod === "vodafone" && !hasCopiedVodafone ? 0.5 : 1,
              cursor:
                paymentMethod === "vodafone" && !hasCopiedVodafone
                  ? "not-allowed"
                  : "pointer",
              transition: "all 0.3s ease",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            Continue to Payment
          </button>
        </form>

        {/* ── RIGHT COLUMN: Order Summary ── */}
        <aside
          className="checkout-summary"
          style={{
            background: "var(--bg-elevated)",
            padding: "2rem",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
          }}
        >
          <h3
            style={{
              fontSize: "1.25rem",
              fontWeight: 800,
              marginBottom: "1.5rem",
            }}
          >
            Your Cart
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              marginBottom: "2rem",
            }}
          >
            {items.map((item) => (
              <div
                key={`${item.product._id}-${item.size}`}
                style={{ display: "flex", gap: "1rem" }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "70px",
                    height: "85px",
                    borderRadius: "6px",
                    overflow: "hidden",
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={item.product.images?.[0]}
                    alt={item.product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    loading="lazy"
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      background: "var(--accent)",
                      color: "#fff",
                      fontSize: "11px",
                      width: "30px",
                      height: "30px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "50%",
                      fontWeight: "bold",
                    }}
                  >
                    {item.qty}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      margin: "0 0 0.25rem 0",
                    }}
                  >
                    {item.product.name}
                  </p>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--text-muted)",
                      margin: 0,
                    }}
                  >
                    Size: {item.size}
                  </p>
                </div>
                <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>
                  LE {(item.product.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              height: "1px",
              background: "var(--border)",
              margin: "1.5rem 0",
            }}
          />

          {/* Discount Code Section */}
          <div style={{ marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="text"
                placeholder="Discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                disabled={!!appliedDiscount || isApplying}
                className="form-input"
                style={{
                  flex: 1,
                  padding: "0.75rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                  background: "var(--bg-elevated)",
                  color: "var(--text)",
                }}
              />
              <button
                type="button"
                onClick={appliedDiscount ? removeDiscount : handleApplyDiscount}
                disabled={
                  (!discountCode.trim() && !appliedDiscount) || isApplying
                }
                className="btn btn-primary"
                style={{
                  padding: "0.75rem 1.25rem",
                  borderRadius: "var(--radius-sm)",
                  background: appliedDiscount ? "var(--error)" : "var(--text)",
                  color: appliedDiscount ? "#fff" : "var(--bg)",
                  border: "none",
                  fontWeight: "bold",
                  cursor:
                    (!discountCode.trim() && !appliedDiscount) || isApplying
                      ? "not-allowed"
                      : "pointer",
                  opacity:
                    (!discountCode.trim() && !appliedDiscount) || isApplying
                      ? 0.7
                      : 1,
                }}
              >
                {isApplying ? "..." : appliedDiscount ? "Remove" : "Apply"}
              </button>
            </div>
            {discountError && (
              <span
                style={{
                  color: "var(--error)",
                  fontSize: "0.8rem",
                  marginTop: "0.5rem",
                  display: "block",
                }}
              >
                {discountError}
              </span>
            )}
            {appliedDiscount && (
              <span
                style={{
                  color: "var(--success)",
                  fontSize: "0.8rem",
                  marginTop: "0.5rem",
                  display: "block",
                }}
              >
                {appliedDiscount.code} applied (-
                {appliedDiscount.discountPercent}%)
              </span>
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
              fontSize: "0.95rem",
            }}
          >
            <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
            <span style={{ fontWeight: 600 }}>LE {total.toFixed(2)}</span>
          </div>

          {appliedDiscount && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
                fontSize: "0.95rem",
                color: "var(--success)",
              }}
            >
              <span>Discount</span>
              <span style={{ fontWeight: 600 }}>
                -LE {discountValue.toFixed(2)}
              </span>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1.5rem",
              fontSize: "0.95rem",
            }}
          >
            <span style={{ color: "var(--text-muted)" }}>Shipping</span>
            {deliveryFee === 0 && !form.governorate ? (
              <span style={{ color: "#999", fontSize: "0.85rem" }}>
                Select Gov
              </span>
            ) : deliveryFee === 0 ? (
              <span style={{ color: "var(--success)", fontWeight: "bold" }}>
                Free
              </span>
            ) : (
              <span style={{ fontWeight: 600 }}>
                LE {deliveryFee.toFixed(2)}
              </span>
            )}
          </div>

          <div
            style={{
              height: "1px",
              background: "var(--border)",
              margin: "1.5rem 0",
            }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "1.2rem",
              fontWeight: 800,
              marginBottom: "2rem",
            }}
          >
            <span>Total</span>
            <span style={{ color: "var(--accent)" }}>
              LE {finalTotal.toFixed(2)}
            </span>
          </div>
        </aside>
      </div>

      {showReturnPolicy && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "2rem",
              maxWidth: "500px",
              width: "100%",
              position: "relative",
              direction: "rtl",
              textAlign: "right",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            }}
          >
            <button
              type="button"
              onClick={() => setShowReturnPolicy(false)}
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                fontSize: "1.25rem",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
            <h3
              style={{
                color: "var(--accent)",
                marginTop: 0,
                marginBottom: "1rem",
                fontSize: "1.2rem",
              }}
            >
              سياسة الاسترجاع والاستبدال
            </h3>
            <div
              style={{
                fontSize: "0.9rem",
                lineHeight: "1.6",
                color: "var(--text)",
              }}
            >
              <p style={{ marginBottom: "0.75rem" }}>
                <strong>عميلنا العزيز،</strong> حرصاً منا على سلامتك العامة
                وطبقاً للاشتراطات الصحية المتبعة عالمياً وفي قانون حماية
                المستهلك المصري:
              </p>

              <p style={{ marginBottom: "0.75rem" }}>
                <strong style={{ color: "#ff4d4f" }}>المنتجات الشخصية:</strong>{" "}
                نعتذر عن استبدال أو استرجاع أي من قطع الملابس الداخلية
                (البوكسرات، الفانلات، الملابس الداخلية الحريمي) بمجرد استلامها
                وفتح الغلاف الخاص بها، وذلك لضمان أعلى معايير النظافة والصحة
                العامة لجميع عملائنا.
              </p>

              <p style={{ marginBottom: "0.75rem" }}>
                <strong style={{ color: "var(--accent)" }}>
                  المعاينة عند الاستلام:
                </strong>{" "}
                يرجى التأكد من المقاس والنوع والعدد فور وصول المندوب وقبل فتح
                الغلاف الداخلي للمنتج. في حالة وجود أي اختلاف أو رغبة في
                التراجع، يمكنكم رفض الاستلام مع دفع مصاريف الشحن فقط.
              </p>

              <p style={{ marginBottom: "0.75rem" }}>
                <strong style={{ color: "var(--accent)" }}>
                  عيوب الصناعة:
                </strong>{" "}
                في حالة وجود عيب صناعة واضح في المنتج، يتم التواصل معنا خلال 24
                ساعة من الاستلام، وسنقوم باستبدال المنتج مجاناً دون تحملكم أي
                تكاليف إضافية (بشرط عدم استخدام المنتج).
              </p>

              <p style={{ margin: 0 }}>
                <strong style={{ color: "var(--accent)" }}>المقاسات:</strong>{" "}
                يرجى مراجعة "جدول المقاسات" الموضح في صفحة كل منتج بعناية قبل
                الطلب، حيث أن اختيار المقاس الخاطئ لا يمنح الحق في الاسترجاع بعد
                فتح المنتج.
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .checkout-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 4rem;
          align-items: start;
        }
        .checkout-form-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 991px) {
          .checkout-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .checkout-summary {
            order: -1; /* Show cart summary above form on mobile */
          }
        }
        @media (max-width: 576px) {
          .checkout-form-row {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
