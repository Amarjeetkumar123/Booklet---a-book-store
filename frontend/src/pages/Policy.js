import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title="Privacy Policy">
      <section className="bg-primary-50 min-h-screen py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6 items-start">
            <div className="rounded-2xl overflow-hidden border border-primary-200 shadow-sm bg-white">
              <img
                src="/images/contactus.jpeg"
                alt="Privacy Policy"
                className="w-full h-full max-h-[520px] object-cover"
              />
            </div>

            <div className="rounded-2xl border border-primary-200 bg-white shadow-sm p-5 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary-900 mb-2">
                Privacy Policy
              </h1>
              <p className="text-sm text-primary-700 mb-4">
                Your data privacy matters to us. Booklet only collects data needed
                to process orders, support your account, and improve service quality.
              </p>

              <ul className="space-y-3 text-sm text-primary-700 m-0 p-0 list-none">
                <li className="rounded-lg border border-primary-200 bg-primary-50/60 px-3 py-2">
                  We use your contact details only for order updates and account support.
                </li>
                <li className="rounded-lg border border-primary-200 bg-primary-50/60 px-3 py-2">
                  Payment processing is handled securely through trusted gateways.
                </li>
                <li className="rounded-lg border border-primary-200 bg-primary-50/60 px-3 py-2">
                  We do not sell your personal information to third parties.
                </li>
                <li className="rounded-lg border border-primary-200 bg-primary-50/60 px-3 py-2">
                  You can request correction or deletion of your account data at any time.
                </li>
                <li className="rounded-lg border border-primary-200 bg-primary-50/60 px-3 py-2">
                  By using Booklet, you agree to this privacy policy and its updates.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Policy;
