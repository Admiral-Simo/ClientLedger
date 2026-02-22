"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Globe, Database, Server } from "lucide-react";

export default function SecurityPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-24 px-6 relative overflow-hidden transition-colors duration-500">
      {/* --- AMBIENT BACKGROUND --- */}
      <div className="absolute inset-0 bg-[radial-gradient(hsl(var(--foreground)/0.03)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-primary/5 blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto space-y-20 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-[10px] font-black text-primary tracking-[0.2em] uppercase">
            <ShieldCheck className="w-3 h-3" />
            Military Grade Infrastructure
          </div>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter leading-none">
            Built for <span className="text-primary">Trust.</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
            As a Cybersecurity professional, I engineered ClientLedger with a
            "Security-First" philosophy. Your financial data is protected by the
            same infrastructure used by global banks.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SecurityCard
            icon={<Lock />}
            title="AWS Cognito Authentication"
            description="Passwords are never stored on our servers. We utilize AWS Cognito for enterprise-grade identity management and JWT-based session security."
          />
          <SecurityCard
            icon={<Database />}
            title="Multi-Tenant Isolation"
            description="Every database query is strictly scoped to your unique Sub ID. Data leakage between accounts is mathematically impossible."
          />
          <SecurityCard
            icon={<Server />}
            title="Encrypted RDS Storage"
            description="Financial records are stored in encrypted Amazon RDS MySQL instances, protected by VPC security groups and restricted IAM roles."
          />
          <SecurityCard
            icon={<Globe />}
            title="End-to-End Encryption"
            description="All data in transit is forced over TLS 1.3. Your invoices and client data remain private from your browser to our cloud."
          />
        </div>
      </div>
    </div>
  );
}

function SecurityCard({ icon, title, description }: any) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 rounded-[2rem] bg-card/40 backdrop-blur-md border border-border/50 hover:border-primary/20 transition-all flex flex-col gap-4"
    >
      <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-black tracking-tight">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed font-medium">
        {description}
      </p>
    </motion.div>
  );
}
