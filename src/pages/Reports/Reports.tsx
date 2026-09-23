import Header from "../../components/Header/Header";

import "./Reports.css";

function Reports() {
    return (
        <div className="reports-page">
            <Header title="Reports" />

            <main className="page-content">
                <section className="report-summary">
                    <div className="section-heading">
                        <h2>Operational overview</h2>
                        <span>Updated today</span>
                    </div>

                    <div className="report-grid">
                        <article className="report-panel accent">
                            <p>Total users</p>
                            <strong>128</strong>
                        </article>
                        <article className="report-panel">
                            <p>Active sessions</p>
                            <strong>91</strong>
                        </article>
                        <article className="report-panel">
                            <p>Response rate</p>
                            <strong>96.4%</strong>
                        </article>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default Reports;
