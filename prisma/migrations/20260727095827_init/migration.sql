-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "propertySize" TEXT NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "extras" TEXT NOT NULL,
    "selectedDate" TEXT NOT NULL,
    "selectedTime" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "stripeSessionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Booking_stripeSessionId_key" ON "Booking"("stripeSessionId");
