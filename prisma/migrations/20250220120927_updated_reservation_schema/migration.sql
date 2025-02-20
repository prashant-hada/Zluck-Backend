-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "status" "ReservationStatus" NOT NULL DEFAULT 'PENDING';
