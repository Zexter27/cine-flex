import { Transform } from "class-transformer";
import {
  IsByteLength,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength
} from "class-validator";

export class RegistrarUsuarioDto {
  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString({ message: "Los nombres deben ser texto." })
  @IsNotEmpty({ message: "Los nombres son obligatorios." })
  @MaxLength(100, { message: "Los nombres no pueden superar 100 caracteres." })
  nombres!: string;

  @Transform(({ value }) => typeof value === "string" ? value.trim() : value)
  @IsString({ message: "Los apellidos deben ser texto." })
  @IsNotEmpty({ message: "Los apellidos son obligatorios." })
  @MaxLength(100, { message: "Los apellidos no pueden superar 100 caracteres." })
  apellidos!: string;

  @Transform(({ value }) => typeof value === "string" ? value.trim().toLowerCase() : value)
  @IsString({ message: "El correo electrónico debe ser texto." })
  @IsNotEmpty({ message: "El correo electrónico es obligatorio." })
  @IsEmail({}, { message: "Ingresa un correo electrónico válido." })
  @MaxLength(254, { message: "El correo electrónico no puede superar 254 caracteres." })
  correoElectronico!: string;

  @IsString({ message: "La contraseña debe ser texto." })
  @IsNotEmpty({ message: "La contraseña es obligatoria." })
  @IsByteLength(12, 72, {
    message: "La contraseña debe tener entre 12 y 72 bytes para protegerse correctamente."
  })
  contrasena!: string;
}
