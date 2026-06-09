import { ArrowRight, ClipboardCheck, GraduationCap, SearchCheck } from "lucide-react";

export function HowItWorks() {
  const steps = [
    { icon: GraduationCap, title: "Select Your Profession", body: "Choose your degree type and career stage." },
    { icon: SearchCheck, title: "Compare Programs", body: "See which lenders support your credentials." },
    { icon: ClipboardCheck, title: "Get Rate Options", body: "Review professional mortgage rate options from matched lenders." },
  ];

  return (
    <section className="bg-surface py-16">
      <div className="container-page">
        <h2 className="text-center text-3xl font-bold text-navy">How it works</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              {index < steps.length - 1 ? <ArrowRight className="absolute -right-4 top-10 hidden text-gold md:block" size={24} /> : null}
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-gold/12 text-gold">
                <step.icon size={23} />
              </span>
              <h3 className="mt-5 text-lg font-bold text-navy">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
