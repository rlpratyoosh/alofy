import { z } from "zod";

export const RegisterUserSchema = z.object({
  username: z
    .string("Username is required to register")
    .min(4, "Username should have at least 4 charracters")
    .max(32, "Username shouldn't have more than 32 characters"),
  email: z.email("Enter a valid email"),
  password: z
    .string("Password is required to register")
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
      "Password must contain at least one special character",
    ),
});

export const LoginUserSchema = z.object({
  username: z
    .string("Username is required to login")
    .min(4, "Username should have at least 4 charracters")
    .max(32, "Username shouldn't have more than 32 characters"),
  password: z
    .string("Password is required to login")
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
      "Password must contain at least one special character",
    ),
});

export const UpdateProfileSchema = z.object({
  displayName: z
    .string("Display Name is reqired")
    .min(4, "Display Name should be at least 4 characters long")
    .max(32, "Display Name should be at most 32 characters long")
    .optional()
    .or(z.literal("")),
  avatarUrl: z.url("Avatar must be a valid URL").optional().or(z.literal("")),
  bio: z.string().max(500, "Bio is too long").optional().or(z.literal("")),
});

export const SubmitCodeSchema = z.object({
  language: z.enum(
    ["cpp", "python", "java"],
    "Language is required (CPP/Python/Java)",
  ),
  version: z.string("Version is required"),
  userCode: z.string("User Code is required"),
  problemSlug: z.string("Problem Slug is required"),
  socketId: z.string("Socket Id is Required"),
  gameId: z.string("Game Id is Required"),
});

export const SubmitDemoCodeSchema = z.object({
  language: z.enum(
    ["cpp", "python", "java"],
    "Language is required (CPP/Python/Java)",
  ),
  version: z.string("Version is required"),
  userCode: z.string("User Code is required"),
  problemSlug: z.string("Problem Slug is required"),
  socketId: z.string("Socket Id is Required"),
});

export const CreateCharacterSchema = z.object({
  name: z
    .string("Name is required")
    .min(4, "Name should be at least 4 characters long")
    .max(32, "Name should be at max 32 characters long"),
  race: z.enum(["human", "elf", "dwarf"], "Race is required (Human/Elf/Dwarf)"),
  gender: z.enum(["male", "female"], "Gender is required (Male/Female)"),
  age: z
    .number("Age is required")
    .min(18, "Play with toys kiddo! (Min age: 18)")
    .max(1000, "Almost dead! (Max age: 1000)"),
  class: z.enum(
    ["cpp", "python", "java"],
    "Language is required (CPP/Python/Java)",
  ),
});

export type SubmitDemoCodeDto = z.infer<typeof SubmitDemoCodeSchema>;
export type CreateCharacterDto = z.infer<typeof CreateCharacterSchema>;
export type SubmitCodeDto = z.infer<typeof SubmitCodeSchema>;
export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;
export type RegisterUserDto = z.infer<typeof RegisterUserSchema>;
export type LoginUserDto = z.infer<typeof LoginUserSchema>;
