import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Link as MuiLink,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";

const schema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
});

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: "10px", height: 56 },
};
const labelSx = { fontWeight: 500 }; // Avenir Medium
const linkSx = { fontWeight: 500 }; // Avenir Heavy

export default function SignInForm() {
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
        <Typography component="label" htmlFor="email" sx={labelSx}>
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

        <Typography component="label" htmlFor="password" sx={labelSx}>
          Password
        </Typography>
        <TextField
          id="password"
          name="password"
          fullWidth
          placeholder="Enter Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{ mt: 1, ...inputSx }}
        />

        <Typography sx={{ textAlign: "right", mt: 1.5, mb: 4, fontSize: 15 }}>
          Can't remember password?{" "}
          <MuiLink href="#" underline="none" sx={linkSx}>
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
            borderRadius: 3,
            textTransform: "none",
            fontSize: 17,
            fontWeight: 800,
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
        <MuiLink href="#" underline="none" sx={linkSx}>
          Sign Up
        </MuiLink>
      </Typography>
    </Box>
  );
}
