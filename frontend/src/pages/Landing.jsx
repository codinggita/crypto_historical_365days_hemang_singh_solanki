import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import { Activity, BarChart2, Shield, Zap, ChevronRight, TrendingUp } from 'lucide-react';
import PageContainer from '../components/layout/PageContainer';
import './Landing.css';

const Landing = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smoother scroll values for parallax
  const smoothY = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  
  // Parallax movements
  const orb1Y = useTransform(smoothY, [0, 1], [0, 300]);
  const orb2Y = useTransform(smoothY, [0, 1], [0, -200]);
  const orb3Y = useTransform(smoothY, [0, 1], [0, 150]);
  
  const heroContentY = useTransform(smoothY, [0, 1], [0, 150]);
  const heroVisualY = useTransform(smoothY, [0, 1], [0, 80]);
  const heroOpacity = useTransform(smoothY, [0, 0.4], [1, 0]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }
  };

  return (
    <PageContainer showHeader={false}>
      <div className="landing-wrapper" ref={containerRef}>
        
        {/* Parallax Floating Background Orbs */}
        <motion.div className="orb orb-1" style={{ y: orb1Y }} />
        <motion.div className="orb orb-2" style={{ y: orb2Y }} />
        <motion.div className="orb orb-3" style={{ y: orb3Y }} />

        {/* Hero Section */}
        <motion.section 
          className="hero-section"
          style={{ y: heroContentY, opacity: heroOpacity }}
        >
          <motion.div 
            className="hero-content"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={fadeInUp} className="hero-badge">
              <span className="live-pulse"></span>
              Live Data Intelligence
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="hero-title">
              Decode the Market.<br/>
              <span className="text-gradient">Dominate the Future.</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="hero-subtitle">
              Advanced analytics, 365-day historical insights, and real-time comparative metrics for the serious crypto investor.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="hero-actions">
              <Link to="/explore" className="btn-glow">
                Explore Markets <ChevronRight size={18} />
              </Link>
              <Link to="/dashboard" className="btn-outline">
                View Dashboard
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.85, rotateY: 10, rotateX: 5 }}
            animate={{ opacity: 1, scale: 1, rotateY: -15, rotateX: 5 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            style={{ y: heroVisualY }}
          >
            {/* Abstract 3D-like Dashboard Card */}
            <InteractiveHeroCard />
          </motion.div>
        </motion.section>

        {/* Features Grid - Scroll Driven */}
        <section className="features-section">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2>Built for <span className="text-gradient">Precision</span></h2>
            <p>Everything you need to analyze cryptographic assets in one place.</p>
          </motion.div>

          <div className="features-grid">
            <FeatureCard 
              icon={<Activity size={32} color="var(--color-primary)" />}
              title="Real-time Tracking"
              desc="Monitor live prices, market caps, and 24h volumes with millisecond precision."
              delay={0.1}
            />
            <FeatureCard 
              icon={<TrendingUp size={32} color="var(--color-primary)" />}
              title="Historical Deep Dive"
              desc="Analyze 365 days of granular chronological data to identify macroeconomic trends."
              delay={0.2}
            />
            <FeatureCard 
              icon={<BarChart2 size={32} color="var(--color-primary)" />}
              title="Advanced Comparison"
              desc="Side-by-side asset comparison revealing correlation and relative strength."
              delay={0.3}
            />
            <FeatureCard 
              icon={<Zap size={32} color="var(--color-primary)" />}
              title="Lightning Fast"
              desc="Optimized backend architecture delivering massive datasets instantly."
              delay={0.4}
            />
            <FeatureCard 
              icon={<Shield size={32} color="var(--color-primary)" />}
              title="Secure Sessions"
              desc="Enterprise-grade JWT authentication protecting your custom watchlists."
              delay={0.5}
            />
          </div>
        </section>

      </div>
    </PageContainer>
  );
};

// Component for the 3D rotating hero visual
const InteractiveHeroCard = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      className="glass-panel main-panel"
      style={{ rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: 0, rotateY: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="panel-header">
        <div className="dot red"></div>
        <div className="dot yellow"></div>
        <div className="dot green"></div>
      </div>
      <div className="panel-body">
        <div className="chart-line"></div>
        <div className="stats-row">
          <div className="stat-box"></div>
          <div className="stat-box active"></div>
          <div className="stat-box"></div>
        </div>
      </div>
    </motion.div>
  );
};

// Component for 3D Tilt Feature Cards
const FeatureCard = ({ icon, title, desc, delay }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-50, 50], [10, -10]);
  const rotateY = useTransform(x, [-50, 50], [-10, 10]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div 
      className="neo-feature-card"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, type: "spring", stiffness: 200 }}
      style={{ rotateX, rotateY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="feature-icon-wrapper">
        {icon}
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </motion.div>
  );
};

export default Landing;
