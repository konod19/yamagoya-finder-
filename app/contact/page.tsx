import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "お問い合わせ・情報の誤りの報告 | 山小屋ファインダー",
};

export default function ContactPage() {
  return (
    <main>
      <section className="bg-charcoal">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <h1 className="font-display text-3xl font-black uppercase leading-[1.1] tracking-tight text-mist sm:text-4xl">
            お問い合わせ・<span className="text-trail">情報の誤り</span>の報告
          </h1>
          <p className="mt-5 max-w-xl text-base text-mist/70">
            山小屋の情報に誤りを見つけた場合や、ご意見・ご感想があればこちらからお送りください。
          </p>
        </div>
      </section>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <ContactForm />
      </div>
    </main>
  );
}
