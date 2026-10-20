import { Expose, Transform } from "class-transformer";
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  Min
} from "class-validator";

export class CrearReservaDto {
  @Expose({ name: "cardNumber" })
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString({ message: "El número de tarjeta debe enviarse como texto." })
  @IsNotEmpty({ message: "Se requiere un número de tarjeta de prueba." })
  @Matches(/^\d{13,19}$/, { message: "El número de tarjeta debe tener entre 13 y 19 dígitos." })
  numeroTarjeta!: string;

  @Expose({ name: "cardHolder" })
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString({ message: "El nombre del titular debe ser texto." })
  @IsNotEmpty({ message: "El nombre del titular es obligatorio." })
  @MaxLength(120, { message: "El nombre del titular no puede superar 120 caracteres." })
  nombreTitular!: string;

  @Expose({ name: "expiryMonth" })
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString({ message: "El mes de expiración debe ser texto." })
  @Length(1, 2, { message: "El mes de expiración debe tener 1 o 2 dígitos." })
  @Matches(/^(0?[1-9]|1[0-2])$/, { message: "El mes de expiración debe estar entre 01 y 12." })
  mesExpiracion!: string;

  @Expose({ name: "expiryYear" })
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString({ message: "El año de expiración debe ser texto." })
  @Matches(/^\d{2,4}$/, { message: "El año de expiración debe tener 2 o 4 dígitos." })
  anioExpiracion!: string;

  @Expose({ name: "cvv" })
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString({ message: "El CVV debe ser texto." })
  @Matches(/^\d{3,4}$/, { message: "El CVV debe contener 3 o 4 dígitos." })
  cvv!: string;

  @Expose({ name: "amount" })
  @Transform(({ value }) => typeof value === "string" || typeof value === "number" ? Number(value) : value)
  @IsNumber({}, { message: "El monto debe ser numérico." })
  @Min(1, { message: "El monto debe ser mayor que cero." })
  monto!: number;

  @Expose({ name: "currency" })
  @Transform(({ value }) => typeof value === "string" ? value.trim().toUpperCase() : value)
  @IsString({ message: "La moneda debe enviarse como texto." })
  @IsIn(["COP", "USD", "EUR"], { message: "La moneda debe ser COP, USD o EUR." })
  moneda!: string;

  @Expose({ name: "cardType" })
  @Transform(({ value }) => typeof value === "string" ? value.trim().toLowerCase() : value)
  @IsString({ message: "El tipo de tarjeta debe ser texto." })
  @IsIn(["visa", "mastercard", "amex", "diners"], { message: "El tipo de tarjeta no es válido." })
  tipoTarjeta!: string;

  @Expose({ name: "email" })
  @Transform(({ value }) => typeof value === "string" ? value.trim().toLowerCase() : value)
  @IsString({ message: "El correo debe ser texto." })
  @IsNotEmpty({ message: "El correo del pagador es obligatorio." })
  correoElectronico!: string;
}
