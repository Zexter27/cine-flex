import { Transform } from "class-transformer";
import {
  IsByteLength,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength
} from "class-validator";

export class InicioSesionDto {
  @Transform(({ value }) => typeof value === "string" ? value.trim().toLowerCase() : value)
  @IsString({ message: "El correo electrónico debe ser texto." })
  @IsNotEmpty({ message: "El correo electrónico es obligatorio." })
  @IsEmail({}, { message: "Ingresa un correo electrónico válido." })
  @MaxLength(254, { message: "El correo electrónico no puede superar 254 caracteres." })
  correoElectronico!: string;

  @IsString({ message: "La contraseña debe ser texto." })
  @IsNotEmpty({ message: "La contraseña es obligatoria." })
  @IsByteLength(1, 72, {
    message: "La contraseña no puede superar los 72 bytes admitidos por el sistema."
  })
  contrasena!: string;
}
