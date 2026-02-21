/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "rgb(var(--primary))",
          foreground: "rgb(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary))",
          foreground: "rgb(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "rgb(var(--accent))",
          foreground: "rgb(var(--accent-foreground))",
        },
        "accent-green": "rgb(var(--accent-green))",
        "accent-purple": "rgb(var(--accent-purple))",
        "accent-blue": "rgb(var(--accent-blue))",
        background: "rgb(var(--background))",
        foreground: "rgb(var(--foreground))",
        card: {
          DEFAULT: "rgb(var(--card))",
          foreground: "rgb(var(--card-foreground))",
        },
        muted: {
          DEFAULT: "rgb(var(--muted))",
          foreground: "rgb(var(--muted-foreground))",
        },
        border: "rgb(var(--border))",
        input: "rgb(var(--input))",
        ring: "rgb(var(--ring))",
        destructive: {
          DEFAULT: "rgb(var(--destructive))",
          foreground: "rgb(var(--destructive-foreground))",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 2px 8px rgb(0 0 0 / 0.2)",
        "card-hover": "0 4px 16px rgb(0 0 0 / 0.3)",
        "accent-glow": "0 0 20px rgb(var(--accent) / 0.3)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-4px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(4px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out forwards",
        "fade-in-up": "fade-in-up 0.4s ease-out forwards",
        "fade-in-up-delay-1": "fade-in-up 0.5s ease-out 0.1s both",
        "fade-in-up-delay-2": "fade-in-up 0.5s ease-out 0.2s both",
        "fade-in-up-delay-3": "fade-in-up 0.5s ease-out 0.3s both",
        "fade-in-up-delay-4": "fade-in-up 0.5s ease-out 0.4s both",
        shimmer: "shimmer 1.5s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        shake: "shake 0.5s ease-in-out",
      },
      transitionDuration: {
        "200": "200ms",
        "300": "300ms",
      },
      typography: () => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": "rgb(var(--muted-foreground))",
            "--tw-prose-headings": "rgb(var(--foreground))",
            "--tw-prose-lead": "rgb(var(--muted-foreground))",
            "--tw-prose-links": "rgb(var(--primary))",
            "--tw-prose-bold": "rgb(var(--foreground))",
            "--tw-prose-counters": "rgb(var(--muted-foreground))",
            "--tw-prose-bullets": "rgb(var(--muted-foreground))",
            "--tw-prose-hr": "rgb(var(--border))",
            "--tw-prose-quotes": "rgb(var(--foreground))",
            "--tw-prose-quote-borders": "rgb(var(--border))",
            "--tw-prose-captions": "rgb(var(--muted-foreground))",
            "--tw-prose-code": "rgb(var(--foreground))",
            "--tw-prose-pre-code": "rgb(var(--foreground))",
            "--tw-prose-pre-bg": "rgb(var(--muted))",
            "--tw-prose-th-borders": "rgb(var(--border))",
            "--tw-prose-td-borders": "rgb(var(--border))",
          },
        },
        invert: {
          css: {
            "--tw-prose-body": "rgb(var(--muted-foreground))",
            "--tw-prose-headings": "rgb(var(--foreground))",
            "--tw-prose-lead": "rgb(var(--muted-foreground))",
            "--tw-prose-links": "rgb(var(--primary))",
            "--tw-prose-bold": "rgb(var(--foreground))",
            "--tw-prose-counters": "rgb(var(--muted-foreground))",
            "--tw-prose-bullets": "rgb(var(--muted-foreground))",
            "--tw-prose-hr": "rgb(var(--border))",
            "--tw-prose-quotes": "rgb(var(--foreground))",
            "--tw-prose-quote-borders": "rgb(var(--border))",
            "--tw-prose-captions": "rgb(var(--muted-foreground))",
            "--tw-prose-code": "rgb(var(--foreground))",
            "--tw-prose-pre-code": "rgb(var(--foreground))",
            "--tw-prose-pre-bg": "rgb(var(--muted))",
            "--tw-prose-th-borders": "rgb(var(--border))",
            "--tw-prose-td-borders": "rgb(var(--border))",
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
