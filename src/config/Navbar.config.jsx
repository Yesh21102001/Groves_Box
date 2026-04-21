// ============================================================
//  NAVBAR CONFIG — src/config/navbar.config.js
//  Change ANYTHING here → navbar updates automatically
//  No need to touch Navbar.jsx at all
// ============================================================

export const navbarConfig = {

    // ── Brand ─────────────────────────────────────────────
    brand: {
        name: "Groves Box",
        emoji: "🌿",
        mobileShort: "GB",
        href: "/",
        color: "#78a240",
        fontSize: "text-2xl md:text-3xl",
        fontWeight: "font-bold",
        emojiSize: "text-3xl md:text-4xl",
    },

    // ── Top Bar ───────────────────────────────────────────
    topBar: {
        bg: "#F0F4F1",
        borderColor: "#E5E7EB",
        height: "h-16 lg:h-20",
        sticky: true,         // sticky top-0
        zIndex: "z-40",
        maxWidth: "max-w-7xl",
    },

    // ── Search Bar ────────────────────────────────────────
    search: {
        placeholder: "Search plants, planters, and more...",
        borderColor: "#9CA3AF",    // gray-400
        focusRingColor: "#244033",
        iconColor: "#9CA3AF",    // gray-400
        borderRadius: "rounded-lg",
        padding: "px-4 py-2.5 pl-10",
        fontSize: "text-base",
    },

    // ── Nav Collection Pills (Desktop) ────────────────────
    collectionPills: {
        activeBg: "#78a240",
        activeText: "#ffffff",
        inactiveBg: "transparent",
        inactiveText: "#374151",
        hoverBg: "#F3F4F6",
        borderRadius: "rounded-full",
        padding: "px-4 py-1.5",
        fontWeight: "font-medium",
        fontSize: "text-sm",
        gap: "gap-2",
        fetchLimit: 12,
        excludeHandles: [],
        displayLimit: 50,
        fallback: [],
    },

    // ── Icon Buttons (Desktop right side) ─────────────────
    icons: {
        color: "#374151",
        hoverColor: "#111827",
        size: 22,
        wishlistHref: "/wishlist",
    },

    // ── Cart Badge ────────────────────────────────────────
    cartBadge: {
        bg: "#78a240",
        textColor: "#ffffff",
        fontSize: "text-xs",
        fontWeight: "font-bold",
    },

    // ── Account Dropdown ──────────────────────────────────
    accountDropdown: {
        width: "w-72",
        borderRadius: "rounded-xl",
        borderColor: "#F3F4F6",    // gray-100
        shadow: "shadow-2xl",

        // Logged-in header gradient
        loggedInGradientFrom: "#78a240",
        loggedInGradientTo: "#009A7B",
        loggedInTextColor: "#ffffff",

        // Menu items
        itemHoverBg: "#F0F4F1",
        itemIconBg: "#F0F4F1",
        itemIconColor: "#78a240",
        itemIconHoverBg: "#78a240",
        itemIconHoverColor: "#ffffff",

        // Logout button
        logoutTextColor: "#DC2626",  // red-600
        logoutHoverBg: "#FEF2F2",  // red-50
        logoutIconBg: "#FEF2F2",

        // Links
        myAccountHref: "/account",
        myAccountLabel: "My Account",

        // Logged-out state
        guestHeaderBg: "#F0F4F1",
        guestSubtitle: "Sign in to your account",
        loginHref: "/login",
        loginLabel: "Log In",
        loginBg: "#78a240",
        loginHoverBg: "#009A7B",
        loginTextColor: "#ffffff",
        signupHref: "/signup",
        signupLabel: "Create Account",
        signupBorderColor: "#78a240",
        signupTextColor: "#78a240",
        signupHoverBg: "#F0F4F1",
    },

    // ── Cart Sidebar ──────────────────────────────────────
    cartSidebar: {
        width: "w-full sm:w-96",
        headerTitleColor: "#78a240",
        headerTitle: "Shopping Cart",
        emptyIcon: true,
        emptyMessage: "Your cart is empty",
        emptyButtonLabel: "Continue Shopping",
        emptyButtonBg: "#78a240",
        emptyButtonHoverBg: "#2F4F3E",

        // Item styles
        itemBorderColor: "#E5E7EB",
        itemNameColor: "#78a240",
        itemPriceColor: "#2F4F3E",
        itemImageBg: "#F3F4F6",

        // Quantity control
        qtyBorderColor: "#D1D5DB",
        removeIconColor: "#EF4444",
        removeHoverBg: "#FEF2F2",

        // Footer
        subtotalLabel: "Subtotal",
        subtotalColor: "#78a240",
        subtotalNote: "Shipping and taxes calculated at checkout",
        subtotalNoteColor: "#6B7280",

        viewCartHref: "/cart",
        viewCartLabel: "View Cart",
        viewCartBg: "#78a240",
        viewCartHoverBg: "#009A7B",
        viewCartTextColor: "#ffffff",

        continueLabel: "Continue Shopping",
        continueBorderColor: "#78a240",
        continueTextColor: "#78a240",
        continueHoverBg: "#F3F4F6",
    },

    // ── Mobile Bottom Navigation Bar ──────────────────────
    mobileBottomNav: {
        bg: "#ffffff",
        borderColor: "#E5E7EB",
        height: "h-16",
        activeColor: "#78a240",
        inactiveColor: "#9CA3AF",  // gray-400
        hoverColor: "#000000",
        iconSize: 24,
        labelFontSize: "text-xs",
        labelFontWeight: "font-medium",
        labelMarginTop: "mt-1",
        items: [
            { label: "Home", icon: "/icons/house.png", href: "/" },
            { label: "Shop", icon: "/icons/shopping-bag.png", href: "/products" },
            { label: "Wishlist", icon: "/icons/heart.png", href: "/wishlist" },
            { label: "Account", icon: "/icons/user.png", href: "/account", authHref: "/login" },
        ],
    },

    // ── Mobile Sidebar Menu ───────────────────────────────
    mobileSidebar: {
        width: "w-80",
        bg: "#ffffff",
        shadow: "shadow-xl",

        // Header
        brandColor: "#78a240",
        brandEmoji: "🌿",
        brandName: "Groves Box",

        // Logged-in user section
        userSectionBg: "#F0F4F1",
        userAvatarBg: "#244033",
        userAvatarTextColor: "#ffffff",

        // Collections section heading
        sectionTitleColor: "#78a240",
        sectionTitleSize: "text-lg",
        sectionTitleWeight: "font-semibold",
        sectionTitle: "Collections",

        // Collection card colors (cycling)
        cardColors: [
            { bg: "bg-orange-50", color: "#fb923c" },
            { bg: "bg-teal-100", color: "#15803d" },
            { bg: "bg-purple-100", color: "#2563eb" },
            { bg: "bg-red-50", color: "#ef4444" },
        ],

        // Extra links below collections
        extraLinks: [
            { label: "Wishlist", icon: "Heart", href: "/wishlist" },
        ],
        extraLinkBorderColor: "#E5E7EB",
        extraLinkTextColor: "#111827",
        extraLinkFontWeight: "font-medium",
        extraLinkChevronColor: "#9CA3AF",

        // Bottom action buttons
        myAccountLabel: "My Account",
        myAccountHref: "/account",
        myAccountBg: "#78a240",
        myAccountHoverBg: "#009A7B",
        myAccountTextColor: "#ffffff",

        logoutLabel: "Logout",
        logoutBorderColor: "#EF4444",
        logoutTextColor: "#EF4444",
        logoutHoverBg: "#FEF2F2",

        loginLabel: "Log In",
        loginHref: "/login",
        loginBg: "#78a240",
        loginHoverBg: "#009A7B",
        loginTextColor: "#ffffff",

        signupLabel: "Sign Up",
        signupHref: "/signup",
        signupBorderColor: "#78a240",
        signupTextColor: "#78a240",
        signupHoverBg: "#F9FAFB",
    },

    // ── Logout Success Modal ──────────────────────────────
    logoutModal: {
        backdropColor: "bg-black/30",
        backdropBlur: "backdrop-blur-sm",
        iconBg: "#DCFCE7",   // green-100
        iconColor: "#16A34A",   // green-600
        iconSize: 48,
        title: "Logged Out Successfully!",
        titleColor: "#111827",
        message: "You have been successfully logged out. Thank you for visiting Groves Box!",
        messageColor: "#4B5563",
        closeLabel: "Close",
        closeBg: "#78a240",
        closeHoverBg: "#009A7B",
        closeTextColor: "#ffffff",
        autoCloseDuration: 2000,        // ms before auto-redirect
        redirectTo: "/",
    },

};