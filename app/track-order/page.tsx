"use client";

const steps = [
    { id: 1, title: "Order Confirmed", desc: "Your plant order is confirmed" },
    { id: 2, title: "Carefully Packed", desc: "Plant is packed with safety" },
    { id: 3, title: "Shipped", desc: "On the way to your home" },
    { id: 4, title: "Delivered", desc: "Plant delivered successfully" },
];

export default function OrderTracking() {
    const currentStep = 2;

    return (
        <div className="bg-[#f5f7f4] px-4 py-10 flex justify-center">
            <div className="w-full max-w-xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl bg-white rounded-3xl shadow-lg p-6 md:p-8">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-[#2f4f3e]">
                        Track Your Plant
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Order ID: <span className="font-medium">#PLNT8942</span>
                    </p>
                </div>

                {/* Product Card */}
                <div className="flex items-center gap-4 bg-[#f0f4f1] rounded-2xl p-4 mb-8">
                    <img
                        src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6"
                        alt="Luxury Indoor Plant"
                        className="w-20 h-20 rounded-xl object-cover"
                    />

                    <div className="flex-1">
                        <h3 className="text-sm md:text-base font-medium text-[#2f4f3e]">
                            Fiddle Leaf Fig
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500">
                            Indoor • 2.5 ft • Ceramic Pot
                        </p>
                    </div>

                    <div className="text-sm md:text-base font-semibold text-[#2f4f3e]">
                        ₹3,999
                    </div>
                </div>

                {/* Tracking Timeline */}
                <div className="space-y-7">
                    {steps.map((step, index) => {
                        const isCompleted = step.id < currentStep;
                        const isActive = step.id === currentStep;

                        return (
                            <div key={step.id} className="flex items-start gap-4">

                                {/* Indicator */}
                                <div className="flex flex-col items-center">
                                    <div
                                        className={`w-5 h-5 rounded-full border-2
                      ${isCompleted
                                                ? "bg-[#3a6b4b] border-[#3a6b4b]"
                                                : isActive
                                                    ? "bg-[#7aa27d] border-[#7aa27d] animate-pulse"
                                                    : "border-gray-300"
                                            }`}
                                    />
                                    {index !== steps.length - 1 && (
                                        <div className="w-px h-12 bg-gray-300 mt-1" />
                                    )}
                                </div>

                                {/* Content */}
                                <div>
                                    <h4
                                        className={`text-sm md:text-base font-medium ${isCompleted || isActive
                                            ? "text-[#2f4f3e]"
                                            : "text-gray-400"
                                            }`}
                                    >
                                        {step.title}
                                    </h4>
                                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="mt-10">
                    <button className="w-full bg-[#244033] text-white py-3 rounded-xl font-medium hover:bg-[#244033] transition">
                        Need Plant Care Help?
                    </button>
                </div>

            </div>
        </div>
    );
}
