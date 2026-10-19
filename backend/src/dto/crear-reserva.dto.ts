import { Expose, Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CrearReservaDto {
  @Expose({ name: "cardNumber" })
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString({ message: "El número de tarjeta debe enviarse como texto." })
  @IsNotEmpty({ message: "Se requiere un número de tarjeta de prueba." })
  @MaxLength(40, { message: "El número de tarjeta no puede superar 40 caracteres." })
  numeroTarjeta!: string;
}
