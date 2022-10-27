<template>
  <div class="about">
    <b-container>
      <b-row>
        <b-col cols="3" class="d-none d-lg-block d-xl-none">
          <ul class="jump-nav">
            <li>
              <nuxt-link :to="{ name: 'about', hash: '#methodology' }">
                Methodology Notes
              </nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name: 'about', hash: '#developers' }">
                Technical Details / Resources for Developers
              </nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name: 'about', hash: '#tos' }">
                Terms of Service / Privacy Notice
              </nuxt-link>
            </li>
            <li>
              <nuxt-link :to="{ name: 'about', hash: '#contact' }">
                Get in Touch
              </nuxt-link>
            </li>
          </ul>
        </b-col>
        <b-col cols="12" lg="9">
          <section id="about" class="mb-5">
            <h2>About this Dashboard</h2>

            <p>The <a href="https://iatistandard.org/" target="_blank">International Aid Transparency Initiative</a> (IATI) is a global effort to improve the transparency of development and humanitarian financing to help address poverty and crises. More than 1,300 organizations — bilateral and multilateral providers, international and local NGOs, civil society organizations, academia, partner country governments, and other stakeholders — publish their data using the IATI Standard.</p>

            <p>
              Following the World Health Organization’s declaration of a pandemic on 11 March 2020, the IATI Secretariat issued a <a href="https://iatistandard.org/en/news/updated-covid-19-guidance-iati-publishers/" target="_blank">Guidance Note on how to publish data on COVID-19 using the IATI Standard</a>, writing that:
            </p><blockquote>Organisations who are involved in the international effort to address the COVID-19 pandemic are strongly encouraged to publish data on all their spending and activities. By publishing timely and comprehensive data, you will be providing partners across the globe with better information to plan, coordinate and evaluate the response to the pandemic.</blockquote>
            </p>

            <p>
              <b>This dashboard was created to visualize, explore and analyze all of the published IATI data that is related to the coronavirus pandemic.</b> It was developed by the <a href="https://centre.humdata.org/" target="_blank">OCHA Centre for Humanitarian Data</a> with the support of the <a href="https://www.usaid.gov/" target="_blank">United States Agency for International Development</a>, and it builds on previous work by Mark Brough at <a href="https://devinit.org/" target="_blank">Development Initiatives</a>.
            </p>

            <p>
              A guiding principle for developing this dashboard has been to ‘hold up a mirror’ to IATI data. The dashboard presents financial information as reported, without attempting any reconciliation among different publishing organizations or verification of those numbers from other sources. In other words, the key data reported here is as received and published by respective publishing organizations.
            </p>
          </section>

          <section id="methodology" class="mb-5">
            <h2>
              Methodology Notes
            </h2>

            <p>The dashboard applies the rules described below to determine which IATI transactions and activities are relevant to the global COVID-19 pandemic, and how to aggregate them.</p>

            <div class="accordion" role="tablist">
              <b-card no-body>
                <b-card-header header-tag="header" role="tab">
                  <b-button v-b-toggle.accordion-1 block squared>
                    General methodology notes
                  </b-button>
                </b-card-header>
                <b-collapse id="accordion-1" accordion="faq-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-text>
                      <h3>Source data</h3>
                      <p>The dashboard is updated with the IATI source data from the <a href="https://d-portal.org/" target="_blank">D-Portal</a> service every 24 hours (<a href="https://github.com/OCHA-DAP/hdx-scraper-iati-viz/blob/main/config/project_configuration.yml" target="_blank">information about the query</a>). The dashboard primarily focuses on the IATI transaction level (where the financial data is), but it pulls default metadata from the parent activity when needed.</p>

                      <h3>Exclusions</h3>
                      <p>As stated above, this dashboard does not make individual judgements about the accuracy of the financial amounts reported, only about whether the IATI data is correctly formed and usable. As such, IATI activities are excluded when they meet any of the following criteria:</p>
                      <ul>
                        <li>reporting organization is a secondary reporter</li>
                        <li>reporting organization is unspecified</li>
                        <li>reporting organization is in a <a href="https://docs.google.com/spreadsheets/d/e/2PACX-1vQxyJ0Y658cIIN1NpbHl4Ah1bZjNnWao7oawdLkl4T_5GC4BF-KMFnzKuzupU-w2Js1_Zy-VmaFJdIW/pub?gid=1705733671&single=true&output=csv" target="_blank">blocklist</a> maintained by The Centre for Humanitarian Data (those that have been discovered to share malformed IATI data)</li>
                        <li>the activity lists related child activities</li>
                      </ul>
                      <p>The dashboard also excludes any financial transactions that have a value of 0, or are not of types 1 (Incoming Funding), 2 (Outgoing Commitment), 3 (Disbursement), 4 (Expenditure), or 11 (Incoming Commitment) in the <a href="https://iatistandard.org/en/iati-standard/203/codelists/transactiontype/" target="_blank">IATI Transaction Type code list</a>. It also excludes all outgoing financial transactions (types 3 or 4) dated before 2020-01-01, since they are too early to be relevant to the pandemic.</p>

                      <h3>Currency conversion</h3>
                      <p>Unless they are already denominated in US dollars (USD), the dashboard converts all transaction values to USD before performing any other operations. The data is transformed using the historical exchange rate from the value date in the IATI transaction: the dashboard uses a <a href="https://codelists.codeforiati.org/ExchangeRates/" target="_blank">hybrid dataset compiled by CodeForIATI</a>, which takes OECD exchange-rate data as the primary source, and data from the Federal Reserve Bank of St Louis (FRED) as a fallback for older rates (not used in this dashboard).</p>

                      <h3>“Strict” and “loose” relevance to the COVID-19 pandemic</h3>
                      <p>The dashboard makes a distinction between “loose” or “strict” relevance to the COVID-19 response: “loose” means that the dashboard is less certain about relevance. In line with the <a href="https://iatistandard.org/en/news/updated-covid-19-guidance-iati-publishers/" target="_blank">IATI COVID-19 Guidance for IATI Publishers</a> and later additions to the <a href="https://iatistandard.org/en/iati-standard/203/codelists/sector/" target="_blank">OECD-DAC sector codes</a>, the dashboard labels a transaction as <b>strictly relevant</b> if it meets any of the following criteria (all string matching is case-insensitive):</p>

                      <ul>
                        <li>The string “COVID-19” appears in the activity title.</li>
                        <li>The string “COVID-19” appears in the transaction description.</li>
                        <li>The <a href="https://glidenumber.net" target="_blank">GLIDE number</a> “EP-2020-000012-001” appears in the activity’s humanitarian scope.</li>
                        <li>The <a href="https://www.unocha.org/sites/unocha/files/Global-Humanitarian-Response-Plan-COVID-19.pdf" target="_blank" />Humanitarian Response Plan</li> code “HCOVD20” appears in the activity’s humanitarian scope.</li>
                        <li>The OECD DAC sector code “12264” appears at the activity or transaction level.</li>
                        <li>The free-text tag “COVID-19” appears at the activity level.</li>
                      </ul>

                      <p>If none of the above applies, the dashboard will still label a transaction as <b>loosely relevant</b> if it meets at least one of the following criteria:</p>

                      <ul>
                        <li>The string “COVID-19” appears in the activity description.</li>
                        <li>The string “COVID” or “CORONAVIRUS” appears in the activity title, or in the activity or transaction description (this is an extension to the IATI guidance).</li>
                      </ul>

                      <p>The dashboard makes the distinction because the string “COVID-19” is likely to appear accidentally in a long description for activities that are not primarily focused on the COVID-19 pandemic, so it is less confident in that activity’s relevance if that is the only indication.</p>

                      <h3>Spending</h3>
                      <p>The dashboard does not make a distinction between disbursement and expense transactions (types 3 or 4 in the <a href="https://iatistandard.org/en/iati-standard/203/codelists/transactiontype/" target="_blank" />IATI Transaction Type Codelist</p>), but treat both as “spending” for the sake of this dashboard. “Spending” data does not include any budgetary or pledged figures.</p>
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>

              <b-card no-body>
                <b-card-header header-tag="header" role="tab">
                  <b-button v-b-toggle.accordion-2 block squared>
                    Additional notes for the Commitments and Spending tab
                  </b-button>
                </b-card-header>
                <b-collapse id="accordion-2" accordion="faq-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-text>
                      <h3>Allocation of spending by sector and recipient country</h3>

                      <p>If an activity lists multiple sectors and/or recipient countries, the dashboard divides each transaction by the percentages given for both. The sectors and recipient countries for the transaction are used if provided at the transaction level, and otherwise the dashboard defaults to those used at the activity level.</p>

                      <p>The current version of the dashboard does not use recipient (multi-country) regions from IATI data, because the overlap with countries would be potentially confusing.</p>

                      <p>For example, if a transaction with a value of $1,000,000 was assigned 30% to Senegal and 70% to Mali, and 50% to Health and 50% to education, the dashboard would split it into four virtual transactions:</p>

                      <ol>
                        <li>Senegal, Health: $150,000 (15%)</li>
                        <li>Senegal, Education: $150,000 (15%)</li>
                        <li>Mali, Health: $350,000 (35%)</li>
                        <li>Mali, Education: $350,000 (35%)</li>
                      </ol>
                      <p>The dashboard utilizes OECD DAC3 and DAC5 purpose codes for sectors, but these are rolled up one further level to DAC groups. See <a href="https://github.com/davidmegginson/c19-iati-data/blob/main/data/dac3-sector-map.json" target="_blank">data/dac3-sector-map.json</a> for the mappings.</p>

                      <h3>Deduplication of commitments and spending</h3>
                      <p>Since each publishing organization publishes its own activities and transactions to the IATI ecosystem, there is a risk of duplicate counting when adding up commitments or spending across multiple organizations. Consider the following example:</p>

                      <ul>
                        <li>Org A gives a grant of $100,000 to Org B</li>
                        <li>Org B uses $50,000 of its grant from Org A to fund a project with Org C.</li>
                        <li>Org C spends $25,000 of its grant from Org B for expenses.</li>
                      </ul>

                      <p>Simply adding up all the different IATI activity reports would suggest that there is $175,000 in total spending, but in fact, $75,000 was the same money reported multiple times. To derive meaningful totals from IATI activities reported by different organizations, the dashboard applies a process called <b>deduplication</b>:</p>

                      <ol>
                        <li>Add up the incoming money that the publisher has reported for the activity, separately for both incoming commitments and actual funding. Whichever is larger represents the <i>existing funding</i> for the activity.</li>
                        <li>Add up all the outgoing commitments (money promised to other organizations) and then subtract the existing funding to get the <i>net new commitments</i>.</li>
                        <li>Add up all the outgoing disbursements and expenditures (money actually spent) and then subtract the existing funding to get the <i>net new spending</i>.</li>
                      </ol>

                      <p>(Negative values are replaced with zero). Whenever the dashboard aggregates commitments or spending from <b>more than one organization</b>, it uses this deduplication process to minimize the risk of duplicate counting. Here’s how the process would apply to the previous example:</p>

                      <ul>
                        <li>Org A’s activity reports no incoming commitments or funding, and $100,000 outgoing commitments and spending, so it has $0 existing funding, and $100,000 net new commitments and spending.</li>
                        <li>Org B’s activity reports $100,000 incoming funding from Org A and a $50,000 outgoing commitment to Org C, so it has $100,000 existing funding, and $0 net new commitments and spending (since both are less than the duplicate funding).</li>
                        <li>Org C’s activity reports $50,000 incoming commitment and $25,000 incoming funding from Org B, so it has $50,000 existing funding, and again, $0 net new spending (since it is less than the duplicate funding).</li>
                      </ul>

                      <p>Now the three activities add up to $100,000 + $0 + $0 = $100,000 spending, which is an accurate representation of the total new money commitment to the COVID-19 response.</p>

                      <p><b>Note:</b> This procedure relies on IATI publishing organizations reporting their incoming funding and commitments correctly. As with any other reporting error, when they do not do so, the totals will be wrong, but the dashboard will still be “holding up a mirror” to what the IATI data claims to be true.</p>

                      <h3>Total vs net money in the dashboard</h3>
                      <p>When filtering the data to just a single organization, the dashboard displays <i>total commitments</i> and <i>total spending</i>, because there is (or should be) no risk of duplicate counting. All of the outgoing commitments and spending that the organization reports are counted.</p>

                      <p>When filtering the data to a single sector or recipient country (and, thus, potentially including multiple organizations), the dashboard displays the <i>net commitments</i> with the <a href="https://docs.google.com/document/d/1sdhfHsjTkjdIFo7cJynoYEGDWdG9O_EtATFJSbJOgLo/edit#heading=h.k46spvg49yg0" target="_blank">Deduplication of commitments and spending</a> procedure applied, to avoid the risk of double counting.</p>

                      <h3>Humanitarian flags</h3>
                      <p>If an activity is flagged positively as humanitarian, the dashboard flags all transactions within it as humanitarian.  When an activity is not flagged positively as humanitarian, but a transaction within that activity does contain the humanitarian flag, the dashboard uses the transaction level flag for that transaction only.</p>
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>

              <b-card no-body>
                <b-card-header header-tag="header" role="tab">
                  <b-button v-b-toggle.accordion-3 block squared>
                    Additional notes for the Spending Flows tab
                  </b-button>
                </b-card-header>
                <b-collapse id="accordion-3" accordion="faq-accordion" role="tabpanel">
                  <b-card-body>
                    <b-card-text>
                      <h3>Aggregation of flows</h3>
                      <p>This tab shows the total of all spending flowing between organizations, across multiple activities and transactions. Example:</p>

                      <ul>
                        <li>In activity 001, Org A reports a disbursement of $25,000 to Org B.</li>
                        <li>In activity 009, Org A reports a disbursement of $75,000 to Org B.</li>
                        <li>In activity 082, Org A reports a disbursement of $50,000 to Org B.</li>
                      </ul>

                      <p>The tab will add all of these disbursements into a single flow of $150,000 from Org A to Org B.</p>
                      <p>When a transaction is of type Expenditure, the dashboard aggregates these in a similar way and labels it as "Direct expenditure".</p>

                      <h3>Monetary values for financial flows</h3>
                      <p>In its current iteration, the flows tab shows only actual spending, not commitments.  For example, if Org A commits $100,000 to an activity reported by Org B, but has not yet disbursed any of the money, the $100,000 will not appear in the flows diagram. Only when the money is actually spent (either through a disbursement to another organization, or as payment for operating expenses) does it appear in the diagram.</p>

                      <p>The values in the diagram are always total values, without <a href="https://docs.google.com/document/d/1sdhfHsjTkjdIFo7cJynoYEGDWdG9O_EtATFJSbJOgLo/edit#heading=h.k46spvg49yg0" target="_blank">deduplication</a>, because a flow always represents one organization’s perspective.</p>

                      <h3>Partner-organization defaults</h3>
                      <p>In addition to the reporting organization, an IATI activity lists other organizations involved in the activity:</p>

                      <ul>
                        <li><b>participating organization</b> — another organization involved at the activity level, for example, as a funding or implementing partner.</li>
                        <li><b>provider organization</b> — the organization providing money in an incoming transaction.</li>
                        <li><b>receiver organization</b> — the organization receiving money in an outgoing transaction.</li>
                      </ul>

                      <p>An activity-level participating organization with a role of “funding” serves as the default provider of funds in any incoming transactions that does not specify a provider org.  A participating organization with a role of “implementing” serves as the default receiver of funds in any outgoing transaction that does not specify a receiver org.</p>

                      <p>Since many IATI publishers do not list provider and receiver orgs at the transaction level, this approach allows the dashboard to capture many flows that would otherwise be missed.</p>

                      <p>For example, if an IATI activity reported by Org A lists Org B as the implementing partner, then publishes an outgoing (disbursement) transaction with no receiver organization specified, the dashboard will assume that Org B is the receiver organization for the transaction, and generate a flow between the two.</p>

                      <p>Where it is not possible to identify the provider or recipient of a transaction, the dashboard labels these as “unspecified organization” and aggregates in the same manner.</p>

                      <h3>Internal transactions</h3>
                      <p>This dashboard excludes all transactions within the same organization, when it is possible to detect them. For example, if an organization reallocates funds internally and if this is possible to detect in the data, that transaction is excluded from the dashboard.</p>
                    </b-card-text>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
          </section>

          <section id="developers" class="mb-5">
            <h2>
              Technical Details / Resources for Developers
            </h2>

            <p>Everything developed for this dashboard is shared as open source software. Data is extracted from <a href="https://d-portal.org/" target="_blank">d-portal.org</a> and transformed every 24 hours.</p>

            <p>
              For more information, view our GitHub repositories:
              <ul>
                <li><a href="https://github.com/ocha-dap/hdx-scraper-iati-viz" target="_blank">Data processing scripts</a></li>
                <li>
                  Prepared data (automatically updated every 24 hours)
                  <ul>
                    <li>Activities and transactions — <a href="https://ocha-dap.github.io/hdx-scraper-iati-viz/transactions.csv">transactions.csv</a> | <a href="https://ocha-dap.github.io/hdx-scraper-iati-viz/transactions.json">transactions.json</a></li>
                    <li>Financial flows — <a href="https://ocha-dap.github.io/hdx-scraper-iati-viz/flows.csv" target="_blank">flows.csv</a> | <a href="https://ocha-dap.github.io/hdx-scraper-iati-viz/flows.json" target="_blank">flows.json</a></li>
                  </ul>
                </li>
                <li><a href="https://github.com/OCHA-DAP/viz-iati-c19-dashboard" target="_blank">Data visualization front end</a></li>
              </ul>
            </p>
          </section>

          <section id="licensing" class="mb-5">
            <h2>IATI open-data licensing</h2>
            <h3>Original source data licensing</h3>
            <p>As described in the <a href="https://iatistandard.org/en/guidance/standard-overview/preparing-your-organisation-data-publication/how-to-license-your-data/" target="_blank">IATI data-licensing guidance</a>, each publishing organization should choose an open-data license when they enroll with the IATI Registry. Using the IATI Dashboard, you can find which license any individual publishing organization is using (scroll down to the list of publishers, then select a publisher to see the license): <a href="http://dashboard.iatistandard.org/files.html" target="_blank">http://dashboard.iatistandard.org/files.html</a></p>
            <h3>Aggregated data</h3>
            <p>In our IATI COVID-19 Funding Dashboard, when filtering commitments and spending by sector or location (country/region), or viewing flows, you are looking at aggregated data compiled from multiple IATI publishers. Onward use of this aggregated data is governed by the open data licenses chosen by the IATI publishers whose data is included. The OCHA Centre for Humanitarian Data claims no additional rights over the aggregated data. For more information about the data-aggregation algorithms, see the About this Dashboard tab.</p>
            <h3>Attribution</h3>
            <p>For IATI publishing organizations who share data under a mandatory attribution license such as CC-BY, attribution is provided for the use of their data in results aggregated by sector, by location, or as flows, in the pull-down organization lists on each tab.</p>
          </section>

          <section id="tos" class="mb-5">
            <h2>
              Terms of Service / Privacy Notice
            </h2>

            <p>The <a href="https://data.humdata.org/" target="_blank">Humanitarian Data Exchange</a> (HDX) <a href="https://data.humdata.org/about/terms" target="_blank">Terms of Service</a> govern your use of this website.</p>
          </section>

          <section id="contact" class="mb-5">
            <h2>
              Get in Touch
            </h2>

            <p>If you have any further questions or comments, please get in touch with us at <a href="mailto:centrehumdata@un.org">centrehumdata@un.org</a>.</p>
          </section>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<style lang='scss'>
.about {
  h2 {
    font-family: 'Gotham Bold', sans-serif;
    font-size: 18px;
    color: #007CE0;
  }
  h3 {
    font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
    font-size: 16px;
    font-weight: bold;
    line-height: 20px;
  }
}
.jump-nav {
  list-style: none;
  position: sticky;
  top: 0;
  li {
    padding: 3px 0;
  }
  a {
    color: #333;
    letter-spacing: 0.01em;
    font-family: 'Gotham Book', sans-serif;
    font-size: 14px;
    line-height: 18px;
    padding: 0;
    &:hover {
      color: #007CE0;
      text-decoration: none;
    }
  }
}
.accordion {
  .card {
    border: none;
    border-bottom: 1px solid #CCC;
    border-radius: 0;
    &:hover {
      background-color: #EDF6FD;
    }
    &:not(:last-of-type) {
      border-bottom: 1px solid #CCC;
    }
  }
  .card-body {
    padding-top: 5px;
  }
  .card-header {
    background-color: transparent;
    border: none;
    padding: 0;
    .btn-secondary {
      background-color: transparent;
      border: none;
      color: #000;
      font-weight: 400;
      font-size: 18px;
      letter-spacing: 0.01em;
      line-height: 24px;
      padding: 27px 10px;
      text-align: left;
      transition: none;
      &:focus {
        box-shadow: none;
      }
      &:not(:disabled):not(.disabled):active,
      &:not(:disabled):not(.disabled).active {
        color: #000;
        background-color: transparent;
        border: none;
      }
    }
  }
}
.logos-section {
  padding: 25px 15px;
  background-color: #007bff;
}
blockquote {
  font-style: italic;
  margin-left: 30px;
}
</style>
<script>
import config from '../nuxt.config'
export default {
  components: {},
  data () {
    return {}
  },
  head () {
    return {
      title: config.head.title + ': About this Dashboard'
    }
  }
}
</script>
