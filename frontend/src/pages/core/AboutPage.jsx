// src/pages/About.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectTheme } from "../../features/theme/themeSlice";

const About = () => {
    const theme = useSelector(selectTheme);
    const isDark = theme === "dark";
    const [visibleSections, setVisibleSections] = useState(new Set());

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setVisibleSections(
                            (prev) => new Set([...prev, entry.target.id]),
                        );
                    }
                });
            },
            { threshold: 0.15 },
        );

        const sections = document.querySelectorAll("[data-animate]");
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const isVisible = (id) => visibleSections.has(id);

    const t = {
        bg: isDark ? "bg-gray-900" : "bg-gray-50",
        cardBg: isDark ? "bg-gray-800" : "bg-white",
        cardBorder: isDark ? "border-gray-700" : "border-gray-200",
        text: isDark ? "text-white" : "text-gray-900",
        textMuted: isDark ? "text-gray-400" : "text-gray-600",
        textFaded: isDark ? "text-gray-500" : "text-gray-400",
        accent: "text-blue-500",
        accentBg: isDark ? "bg-blue-500/10" : "bg-blue-50",
        accentBorder: isDark ? "border-blue-500/30" : "border-blue-200",
        hover: isDark ? "hover:bg-gray-700" : "hover:bg-gray-100",
        divider: isDark ? "border-gray-700" : "border-gray-200",
        featureIcon: isDark ? "bg-gray-700" : "bg-gray-100",
    };

    const features = [
        {
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                </svg>
            ),
            title: "Easy Uploads",
            description:
                "Upload your videos in any format with lightning-fast processing",
        },
        {
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z"
                    />
                </svg>
            ),
            title: "Smooth Streaming",
            description:
                "Streaming ensures buffer-free playback across all devices and network conditions.",
        },
        {
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                    />
                </svg>
            ),
            title: "Community First",
            description:
                "Build your audience with comments, likes, subscriptions, and community posts that drive engagement.",
        },
        {
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                    />
                </svg>
            ),
            title: "Creator Dashboard",
            description:
                "Powerful analytics and management tools to help creators understand and grow their audience.",
        },
        {
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    />
                </svg>
            ),
            title: "Secure & Private",
            description:
                "Enterprise-grade security with encrypted data, secure authentication, and full privacy controls.",
        },
        {
            icon: (
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                    />
                </svg>
            ),
            title: "Fully Responsive",
            description:
                "Seamless experience across desktop, tablet, and mobile with a thoughtfully designed interface.",
        },
    ];

    const milestones = [
        {
            year: "2025",
            title: "The Beginning",
            description:
                "Streamly was born from a simple idea — a platform where creators truly come first.",
        },
        {
            year: "2026",
            title: "Growing Fast",
            description:
                "Reaching creators and launched community features, playlists, and the creator dashboard.",
        },
    ];

    const techStack = [
        { name: "React", color: "text-cyan-400" },
        { name: "Redux", color: "text-purple-400" },
        { name: "Node.js", color: "text-green-400" },
        { name: "MongoDB", color: "text-emerald-400" },
        { name: "Express", color: "text-yellow-400" },
        { name: "Tailwind CSS", color: "text-sky-400" },
        { name: "Cloudinary", color: "text-blue-400" },
        { name: "JWT Auth", color: "text-red-400" },
    ];

    // ─── UPDATE THESE WITH YOUR REAL INFO ───
    const creator = {
        name: "Vikas Kumar",
        username: "ooyevikku",
        avatar: "https://media.licdn.com/dms/image/v2/D5603AQE3LJMJNBg4ZA/profile-displayphoto-scale_200_200/B56Zvl87epJEAc-/0/1769089516336?e=1772064000&v=beta&t=tficCw9121qFG6OphAiKeNlDhQWAonmbo0dOxOZmOlk",
        coverImage:
            "https://media.licdn.com/dms/image/v2/D5616AQEkjKG-2a-UKQ/profile-displaybackgroundimage-shrink_350_1400/B56Zv3BTZYH4AY-/0/1769375874812?e=1772064000&v=beta&t=8fKYFdP9eI3i3Bjj3UXN3IVn02crxo6LvNafgII8TnA",
        bio: "Full-stack developer passionate about building products that empower creators. I designed, developed, and shipped Streamly as a solo project to sharpen my skills and create something meaningful.",
        location: "India",
        tagline: "Developer · Designer · Creator",
        skills: [
            "React",
            "Node.js",
            "MongoDB",
            "Express",
            "Tailwind CSS",
            "REST APIs",
        ],
        socials: [
            {
                name: "GitHub",
                url: "https://github.com/vikaskumar2611",
                icon: (
                    <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                ),
                color: isDark
                    ? "hover:bg-gray-700 hover:text-white"
                    : "hover:bg-gray-900 hover:text-white",
                label: "vikaskumar2611",
            },
            {
                name: "LinkedIn",
                url: "https://www.linkedin.com/in/vikas-kumar-070981361",
                icon: (
                    <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                ),
                color: "hover:bg-blue-700 hover:text-white",
                label: "vikas kumar",
            },
            {
                name: "Twitter / X",
                url: "https://x.com/yourusername",
                icon: (
                    <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                ),
                color: isDark
                    ? "hover:bg-gray-700 hover:text-white"
                    : "hover:bg-gray-900 hover:text-white",
                label: "@yourusername",
            },
            {
                name: "Portfolio",
                url: "https://yourportfolio.com",
                icon: (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
                        />
                    </svg>
                ),
                color: "hover:bg-emerald-600 hover:text-white",
                label: "yourportfolio.com",
            },
            {
                name: "Email",
                url: "mailto:vikaskumar261104@gmail.com",
                icon: (
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                        />
                    </svg>
                ),
                color: "hover:bg-red-500 hover:text-white",
                label: "vikaskumar261104@gmail.com",
            },
            {
                name: "Discord",
                url: "https://discord.gg/yourinvite",
                icon: (
                    <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
                    </svg>
                ),
                color: "hover:bg-indigo-600 hover:text-white",
                label: "Streamly Server",
            },
        ],
    };

    return (
        <div className={`min-h-screen ${t.bg} overflow-x-hidden`}>
            {/* ═══════════ Hero Section ═══════════ */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
                    <div
                        id="hero-badge"
                        data-animate
                        className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8
                            ${t.accentBg} ${t.accent} border ${t.accentBorder}
                            transition-all duration-700
                            ${isVisible("hero-badge") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                        </span>
                        About Streamly
                    </div>

                    <h1
                        id="hero-title"
                        data-animate
                        className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight
                            transition-all duration-700 delay-100
                            ${isVisible("hero-title") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                            ${t.text}`}
                    >
                        Where{" "}
                        <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                            Creativity
                        </span>{" "}
                        Meets{" "}
                        <span className="bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
                            Community
                        </span>
                    </h1>

                    <p
                        id="hero-subtitle"
                        data-animate
                        className={`text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed
                            transition-all duration-700 delay-200
                            ${isVisible("hero-subtitle") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
                            ${t.textMuted}`}
                    >
                        Streamly is a modern video sharing platform built for
                        creators who want to share their stories, connect with
                        audiences, and build something extraordinary.
                    </p>

                    <div
                        id="hero-cta"
                        data-animate
                        className={`flex flex-col sm:flex-row items-center justify-center gap-4
                            transition-all duration-700 delay-300
                            ${isVisible("hero-cta") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
                    >
                        <Link
                            to="/home"
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
                        >
                            Start Exploring
                        </Link>
                        <Link
                            to="/register"
                            className={`px-8 py-3 rounded-xl font-semibold border-2 transition-all duration-300 hover:scale-105
                                ${
                                    isDark
                                        ? "border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-gray-800"
                                        : "border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-100"
                                }`}
                        >
                            Join Us
                        </Link>
                    </div>
                </div>
            </section>

            {/* ═══════════ Mission Section ═══════════ */}
            <section
                id="mission"
                data-animate
                className={`max-w-5xl mx-auto px-4 sm:px-6 py-16
                    transition-all duration-700
                    ${isVisible("mission") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
                <div
                    className={`${t.cardBg} border ${t.cardBorder} rounded-3xl p-8 sm:p-12 relative overflow-hidden`}
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                    <div className="grid md:grid-cols-2 gap-10 items-center">
                        <div>
                            <h2
                                className={`text-3xl sm:text-4xl font-bold mb-4 ${t.text}`}
                            >
                                Our Mission
                            </h2>
                            <p
                                className={`text-base leading-relaxed mb-4 ${t.textMuted}`}
                            >
                                We believe every person has a story worth
                                sharing. Streamly exists to remove the barriers
                                between creators and their audiences, providing
                                powerful yet intuitive tools that make video
                                sharing accessible to everyone.
                            </p>
                            <p
                                className={`text-base leading-relaxed ${t.textMuted}`}
                            >
                                From aspiring filmmakers to educators, musicians
                                to tech enthusiasts — Streamly is the stage
                                where diverse voices find their spotlight and
                                communities flourish.
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <div className="relative w-64 h-64">
                                <div
                                    className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping"
                                    style={{ animationDuration: "3s" }}
                                />
                                <div
                                    className="absolute inset-4 rounded-full border-2 border-purple-500/20 animate-ping"
                                    style={{
                                        animationDuration: "3s",
                                        animationDelay: "0.5s",
                                    }}
                                />
                                <div
                                    className="absolute inset-8 rounded-full border-2 border-pink-500/20 animate-ping"
                                    style={{
                                        animationDuration: "3s",
                                        animationDelay: "1s",
                                    }}
                                />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-blue-500/30">
                                        <svg
                                            className="w-12 h-12 text-white"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth={1.5}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════ Features Section ═══════════ */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
                <div
                    id="features-header"
                    data-animate
                    className={`text-center mb-12 transition-all duration-700
                        ${isVisible("features-header") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <h2
                        className={`text-3xl sm:text-4xl font-bold mb-4 ${t.text}`}
                    >
                        Built for Creators
                    </h2>
                    <p className={`text-lg max-w-2xl mx-auto ${t.textMuted}`}>
                        Every feature is thoughtfully designed to help you
                        create, share, and grow.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            id={`feature-${index}`}
                            data-animate
                            className={`${t.cardBg} border ${t.cardBorder} rounded-2xl p-6
                                hover:scale-[1.03] hover:shadow-xl transition-all duration-300 group cursor-default
                                ${isVisible(`feature-${index}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div
                                className={`w-12 h-12 ${t.featureIcon} rounded-xl flex items-center justify-center mb-4
                                group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300 ${t.accent}`}
                            >
                                {feature.icon}
                            </div>
                            <h3
                                className={`text-lg font-semibold mb-2 ${t.text}`}
                            >
                                {feature.title}
                            </h3>
                            <p
                                className={`text-sm leading-relaxed ${t.textMuted}`}
                            >
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════ Timeline / Milestones ═══════════ */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
                <div
                    id="timeline-header"
                    data-animate
                    className={`text-center mb-12 transition-all duration-700
                        ${isVisible("timeline-header") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <h2
                        className={`text-3xl sm:text-4xl font-bold mb-4 ${t.text}`}
                    >
                        Our Journey
                    </h2>
                    <p className={`text-lg max-w-2xl mx-auto ${t.textMuted}`}>
                        From a spark of an idea to a growing platform — here's
                        how we got here.
                    </p>
                </div>

                <div className="relative">
                    <div
                        className={`absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 ${isDark ? "bg-gray-700" : "bg-gray-200"} sm:-translate-x-0.5`}
                    />

                    <div className="space-y-12">
                        {milestones.map((milestone, index) => (
                            <div
                                key={milestone.year}
                                id={`milestone-${index}`}
                                data-animate
                                className={`relative flex flex-col sm:flex-row items-start gap-6
                                    transition-all duration-700
                                    ${isVisible(`milestone-${index}`) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
                                    ${index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                                style={{ transitionDelay: `${index * 150}ms` }}
                            >
                                <div
                                    className={`flex-1 ml-14 sm:ml-0 ${index % 2 === 0 ? "sm:text-right sm:pr-12" : "sm:text-left sm:pl-12"}`}
                                >
                                    <div
                                        className={`${t.cardBg} border ${t.cardBorder} rounded-2xl p-6 inline-block text-left
                                        hover:shadow-lg transition-shadow duration-300`}
                                    >
                                        <span className="text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                            {milestone.year}
                                        </span>
                                        <h3
                                            className={`text-xl font-semibold mt-1 mb-2 ${t.text}`}
                                        >
                                            {milestone.title}
                                        </h3>
                                        <p
                                            className={`text-sm leading-relaxed ${t.textMuted}`}
                                        >
                                            {milestone.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="absolute left-6 sm:left-1/2 sm:-translate-x-1/2 w-3 h-3 mt-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 ring-4 ring-opacity-30 ring-blue-500 z-10" />

                                <div className="flex-1 hidden sm:block" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════ Meet the Creator ═══════════ */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
                <div
                    id="creator-header"
                    data-animate
                    className={`text-center mb-12 transition-all duration-700
                        ${isVisible("creator-header") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <h2
                        className={`text-3xl sm:text-4xl font-bold mb-4 ${t.text}`}
                    >
                        Meet the Creator
                    </h2>
                    <p className={`text-lg max-w-2xl mx-auto ${t.textMuted}`}>
                        One person. One vision. Built from scratch with passion.
                    </p>
                </div>

                <div
                    id="creator-card"
                    data-animate
                    className={`${t.cardBg} border ${t.cardBorder} rounded-3xl overflow-hidden relative
                        transition-all duration-700
                        ${isVisible("creator-card") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    {/* Top gradient banner */}
                    <div className="h-32 sm:h-40 relative overflow-hidden">
                        {/* Cover Image */}
                        <img
                            src={creator.coverImage}
                            alt="Cover"
                            className="absolute inset-0 w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = "none";
                            }}
                        />
                    </div>

                    <div className="px-6 sm:px-10 pb-8">
                        {/* Avatar */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-16 sm:-mt-14 mb-6">
                            <div className="relative group">
                                <div className="absolute -inset-1  rounded-full group-hover:opacity-100 blur transition-opacity duration-300" />
                                <img
                                    src={creator.avatar}
                                    alt={creator.name}
                                    className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4
                                        ${isDark ? "border-gray-800" : "border-white"}`}
                                />
                            </div>

                            <div className="text-center sm:text-left sm:pb-1 flex-1">
                                <h3
                                    className={`mt-13 text-2xl sm:text-3xl font-bold ${t.text}`}
                                >
                                    {creator.name}
                                </h3>
                                <p className="text-blue-500 font-medium text-sm">
                                    @{creator.username}
                                </p>
                                <p className={`text-sm mt-1 ${t.textMuted}`}>
                                    {creator.tagline}
                                </p>
                            </div>

                            {/* Location badge */}
                            <div
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                                ${t.accentBg} ${t.accent} border ${t.accentBorder}`}
                            >
                                <svg
                                    className="w-3.5 h-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                                    />
                                </svg>
                                {creator.location}
                            </div>
                        </div>

                        {/* Bio */}
                        <p
                            className={`text-sm sm:text-base leading-relaxed mb-8 max-w-2xl ${t.textMuted}`}
                        >
                            {creator.bio}
                        </p>

                        {/* Skills */}
                        <div className="mb-8">
                            <h4
                                className={`text-xs font-semibold uppercase tracking-wider mb-3 ${t.textFaded}`}
                            >
                                Skills & Technologies
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {creator.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 cursor-default
                                            ${
                                                isDark
                                                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                            }`}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Divider */}
                        <div className={`border-t ${t.divider} my-6`} />

                        {/* Social Links */}
                        <div>
                            <h4
                                className={`text-xs font-semibold uppercase tracking-wider mb-4 ${t.textFaded}`}
                            >
                                Connect with Me
                            </h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {creator.socials.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 group
                                            hover:scale-[1.02] hover:shadow-lg
                                            ${t.cardBorder} ${t.textMuted} ${social.color}`}
                                    >
                                        <span className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                                            {social.icon}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-semibold truncate">
                                                {social.name}
                                            </p>
                                            <p className="text-xs truncate opacity-70">
                                                {social.label}
                                            </p>
                                        </div>
                                        <svg
                                            className="w-4 h-4 flex-shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                            />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════ Tech Stack ═══════════ */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
                <div
                    id="tech-header"
                    data-animate
                    className={`text-center mb-10 transition-all duration-700
                        ${isVisible("tech-header") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    <h2
                        className={`text-3xl sm:text-4xl font-bold mb-4 ${t.text}`}
                    >
                        Powered By
                    </h2>
                    <p className={`text-lg max-w-2xl mx-auto ${t.textMuted}`}>
                        Built with modern, battle-tested technologies.
                    </p>
                </div>

                <div
                    id="tech-grid"
                    data-animate
                    className={`flex flex-wrap justify-center gap-3 transition-all duration-700
                        ${isVisible("tech-grid") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                >
                    {techStack.map((tech, index) => (
                        <div
                            key={tech.name}
                            className={`${t.cardBg} border ${t.cardBorder} rounded-xl px-5 py-3
                                hover:scale-110 hover:shadow-lg transition-all duration-300 cursor-default`}
                            style={{ transitionDelay: `${index * 50}ms` }}
                        >
                            <span
                                className={`text-sm font-semibold ${tech.color}`}
                            >
                                {tech.name}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ═══════════ CTA Section ═══════════ */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 pb-24">
                <div
                    id="cta"
                    data-animate
                    className={`relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center
                        transition-all duration-700
                        ${isVisible("cta") ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30" />

                    <div className="relative z-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Ready to Start Creating?
                        </h2>
                        <p className="text-lg text-blue-100 max-w-xl mx-auto mb-8">
                            Join thousands of creators who are already sharing
                            their passion with the world on Streamly.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl shadow-lg
                                    hover:bg-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300"
                            >
                                Create Your Account
                            </Link>
                            <Link
                                to="/home"
                                className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold rounded-xl
                                    hover:bg-white/10 hover:border-white/50 hover:scale-105 transition-all duration-300"
                            >
                                Browse Videos
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <div className={`border-t ${t.divider} py-8`}>
                <p className={`text-center text-sm ${t.textFaded}`}>
                    © {new Date().getFullYear()} Streamly. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default About;
