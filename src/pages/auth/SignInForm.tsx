import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  InputAdornment,
  IconButton,
  Link as MuiLink,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { Eye, EyeOff } from "lucide-react";

const schema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: "8px", height: 56 },
};

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async () => {
      // Pretend to sign in: show the loading state for 2 seconds, send nothing
      await new Promise((resolve) => setTimeout(resolve, 2000));
    },
  });

  return (
    <Box>
      <form onSubmit={formik.handleSubmit} noValidate>
        <Typography component="label" htmlFor="email">
          Email
        </Typography>
        <TextField
          id="email"
          name="email"
          fullWidth
          placeholder="Enter Email Address"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          sx={{ mt: 1, mb: 3, ...inputSx }}
        />

        <Typography component="label" htmlFor="password">
          Password
        </Typography>
        <TextField
          id="password"
          name="password"
          fullWidth
          placeholder="Enter Password"
          type={showPassword ? "text" : "password"}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ mt: 1, ...inputSx }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Show or hide password"
                    onClick={() => setShowPassword((s) => !s)}
                    edge="end"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Typography sx={{ textAlign: "right", mt: 1.5, mb: 4, fontSize: 15 }}>
          Can't remember password?{" "}
          <MuiLink href="#" underline="none" sx={{ fontWeight: 700 }}>
            Reset Password
          </MuiLink>
        </Typography>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={formik.isSubmitting}
          sx={{
            height: 56,
            borderRadius: 999,
            textTransform: "none",
            fontSize: 17,
            fontWeight: 600,
            boxShadow: "none",
          }}
        >
          {formik.isSubmitting ? (
            <CircularProgress size={22} sx={{ color: "#fff" }} />
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <Typography sx={{ textAlign: "center", mt: 3, fontSize: 15 }}>
        Don't have an account?{" "}
        <MuiLink href="#" underline="none" sx={{ fontWeight: 700 }}>
          Sign Up
        </MuiLink>
      </Typography>
    </Box>
  );
}
