/* Further reading for every lesson: standards and primary sources first, then textbooks, practitioner guides and explainers.
   Format: [title, url, who · what] */
(function(){
const W=(t,slug)=>[t,'https://en.wikipedia.org/wiki/'+slug,'Wikipedia'];
const CFI=(t,path)=>[t,'https://corporatefinanceinstitute.com/resources/'+path,'Corporate Finance Institute · guide'];
const WSP=(t,path)=>[t,'https://www.wallstreetprep.com/knowledge/'+path,'Wall Street Prep · guide'];
const DAM=['Damodaran Online: valuation data (betas, ERP, multiples)','https://pages.stern.nyu.edu/~adamodar/New_Home_Page/data.html','Aswath Damodaran, NYU Stern · data'];
const DAMV=['Valuation lecture notes, packet 1: intrinsic valuation','https://pages.stern.nyu.edu/~adamodar/pdfiles/eqnotes/valpacket1spr24.pdf','Aswath Damodaran, NYU Stern · lecture notes'];
const DAMTV=['Session 9: Terminal value','https://pages.stern.nyu.edu/~adamodar/pdfiles/valonlineslides/session9.pdf','Aswath Damodaran, NYU Stern · slides'];
const ROSE=['Investment Banking (Rosenbaum & Pearl), ch. 6 Sell-side M&A (free excerpt)','https://www.intralinks.com/sites/default/files/file_attach/investment-banking-chapter-6.pdf','Rosenbaum & Pearl · book chapter'];
const IFRS3=['IFRS 3 Business Combinations','https://www.ifrs.org/issued-standards/list-of-standards/ifrs-3-business-combinations/','IFRS Foundation · standard'];
const IAS36=['IAS 36 Impairment of Assets','https://www.ifrs.org/issued-standards/list-of-standards/ias-36-impairment-of-assets/','IFRS Foundation · standard'];
const TSMD=['ASC 260 roadmap: 4.2 Treasury stock method','https://dart.deloitte.com/USDART/home/codification/presentation/asc260-10/roadmap-earnings-per-share/chapter-4-diluted-eps/4-2-treasury-stock-method','Deloitte DART · accounting guidance'];
const BUF=['Berkshire Hathaway 2000 shareholder letter (on EBITDA)','https://www.berkshirehathaway.com/2000ar/2000letter.html','Warren Buffett · primary source'];
const IPOB=['Updated Investor Bulletin: Investing in an IPO','https://www.investor.gov/news-alerts/investor-bulletins/investor-bulletin-investing-ipo','U.S. SEC, Investor.gov · bulletin'];
ML.src={
  'three-statements':[W('Financial statement','Financial_statement'),W('Cash flow statement','Cash_flow_statement'),W('Balance sheet','Balance_sheet'),DAMV],
  'ebitda':[W('EBITDA','Earnings_before_interest,_taxes,_depreciation_and_amortization'),BUF,W('Income statement','Income_statement')],
  'depreciation-walk':[W('Depreciation','Depreciation'),W('Capital expenditure','Capital_expenditure'),W('Fixed asset','Fixed_asset')],
  'working-capital':[W('Working capital','Working_capital'),W('Cash conversion cycle','Cash_conversion_cycle'),W('Days sales outstanding','Days_sales_outstanding')],
  'diluted-shares':[TSMD,CFI('Treasury Stock Method','valuation/treasury-stock-method/'),['Treasury stock method','https://www.accountingtools.com/articles/treasury-stock-method.html','AccountingTools · explainer'],W('Earnings per share','Earnings_per_share')],
  'goodwill':[IFRS3,IAS36,W('Goodwill (accounting)','Goodwill_(accounting)')],
  'enterprise-value':[W('Enterprise value','Enterprise_value'),['Enterprise Value vs Equity Value: The Complete Guide','https://mergersandinquisitions.com/enterprise-value-vs-equity-value/','Mergers & Inquisitions · guide'],DAMV],
  'ev-bridge':[['Equity Value to Enterprise Value Bridge','https://wallstreetprep.com/knowledge/equity-value-to-enterprise-value-bridge','Wall Street Prep · guide'],['Equity and Enterprise Value Bridge','https://www.fe.training/free-resources/valuation/equity-and-enterprise-value-bridge/','Financial Edge · guide'],W('Enterprise value','Enterprise_value')],
  'free-cash-flow':[W('Free cash flow','Free_cash_flow'),DAMV,W('Net operating profit after tax','Net_operating_profit_after_tax')],
  'wacc':[W('Weighted average cost of capital','Weighted_average_cost_of_capital'),W('Capital asset pricing model','Capital_asset_pricing_model'),DAM,W('Modigliani–Miller theorem','Modigliani%E2%80%93Miller_theorem')],
  'dcf':[DAMV,W('Discounted cash flow','Discounted_cash_flow'),DAM],
  'terminal-value':[DAMTV,W('Terminal value (finance)','Terminal_value_(finance)'),W('Dividend discount model (Gordon growth)','Dividend_discount_model')],
  'trading-comps':[W('Valuation using multiples','Valuation_using_multiples'),DAM,CFI('Football field chart (valuation methods overview)','valuation/football-field-chart/')],
  'precedents':[W('Valuation using multiples','Valuation_using_multiples'),W('Takeover','Takeover'),ROSE],
  'strategic':[CFI('Strategic Buyer vs Financial Buyer','valuation/strategic-buyer-vs-financial-buyer'),WSP('Strategic buyer','strategic-buyer/'),['Strategic Buyers vs. Private Equity Buyers in an Investment Process','https://flora.insead.edu/fichiersti_wp/inseadwp2014/2014-39.pdf','INSEAD working paper (Vild & Zeisberger)'],W('Mergers and acquisitions','Mergers_and_acquisitions')],
  'sponsor':[W('Private equity','Private_equity'),['Strategic Buyers vs. Private Equity Buyers in an Investment Process','https://flora.insead.edu/fichiersti_wp/inseadwp2014/2014-39.pdf','INSEAD working paper (Vild & Zeisberger)'],W('Carried interest','Carried_interest')],
  'synergies':[W('Synergy','Synergy'),W('Mergers and acquisitions','Mergers_and_acquisitions'),WSP('Merger model','merger-model')],
  'cash-vs-stock':[WSP('Merger model (consideration mix)','merger-model'),W('Mergers and acquisitions','Mergers_and_acquisitions'),['Merger model','https://corporatefinanceinstitute.com/resources/knowledge/modeling/build-merger-model','Corporate Finance Institute · guide']],
  'stock-deal':[CFI('Asset Purchase vs Stock Purchase','valuation/asset-purchase-vs-stock-purchase/'),['Stock sale versus asset sale in M&A transactions','https://www.ibanet.org/Stock-sale-versus-asset-sale-in-M&A-transactions','International Bar Association · article'],['Asset sale vs. stock sale','https://carta.com/learn/startups/exit-strategies/mergers-acquisitions/asset-sale-vs-stock-sale/','Carta · guide']],
  'accretion-dilution':[W('Accretion/dilution analysis','Accretion/dilution_analysis'),WSP('Merger model (accretion / dilution)','merger-model'),CFI('Accretion / dilution','valuation/accretion-dilution/')],
  'earnouts':[W('Earnout','Earnout'),IFRS3],
  'fairness-opinion':[W('Fairness opinion','Fairness_opinion'),ROSE,WSP('Football field valuation','football-field-valuation-real-example-excel-template/')],
  'football-field':[WSP('Football field valuation','football-field-valuation-real-example-excel-template/'),CFI('Football field chart','valuation/football-field-chart/'),['Football Field','https://fe.training/free-resources/valuation/football-field','Financial Edge · guide']],
  'cap-structure':[W('Capital structure','Capital_structure'),W('Absolute priority rule','Absolute_priority_rule'),W('Mezzanine capital','Mezzanine_capital')],
  'leverage-ratios':[W('Leverage (finance)','Leverage_(finance)'),W('Times interest earned','Times_interest_earned'),W('Credit rating','Credit_rating')],
  'covenants':[W('Loan covenant','Loan_covenant'),W('Leveraged loan','Leveraged_loan'),W('Default (finance)','Default_(finance)')],
  'lbo':[W('Leveraged buyout','Leveraged_buyout'),W('Private equity','Private_equity'),DAMV],
  'return-drivers':[W('Leveraged buyout','Leveraged_buyout'),WSP('MOIC: multiple on invested capital','moic-multiple-on-invested-capital/'),['What does MOIC mean in private equity?','https://eqtgroup.com/thinq/Education/what-does-moic-mean-in-private-equity','EQT · explainer']],
  'moic':[WSP('MOIC: multiple on invested capital','moic-multiple-on-invested-capital/'),['Multiple on invested capital (MOIC)','https://carta.com/learn/private-funds/management/fund-performance/moic/','Carta · guide'],W('Internal rate of return','Internal_rate_of_return')],
  'ipo':[IPOB,W('Initial public offering','Initial_public_offering'),W('Book building','Bookbuilding')],
  'greenshoe':[W('Greenshoe','Greenshoe'),IPOB,W('Underwriting','Underwriting')],
  'converts':[W('Convertible bond','Convertible_bond'),W('Convertible arbitrage','Convertible_arbitrage'),W('Earnings per share (diluted)','Earnings_per_share')],
  'auction':[ROSE,WSP('Sell-side process','sell-side-process/'),['The M&A Sale Process: Teasers, CIMs, Data Rooms & Fairness Opinions','https://ryanoconnellfinance.com/ma-sale-process/','Ryan O’Connell · explainer']],
  'cim':[['What’s in a Confidential Information Memorandum (CIM)?','https://mergersandinquisitions.com/confidential-information-memorandum/','Mergers & Inquisitions · guide'],['Confidential Information Memorandum (CIM)','https://www.wallstreetprep.com/knowledge/confidential-information-memorandum-cim-example-pdf-download','Wall Street Prep · guide'],ROSE],
  'qoe':[CFI('Quality of Earnings Report','valuation/quality-of-earnings-report/'),['All About Quality of Earnings Reports and How to Read Them','https://weaver.com/resources/all-about-quality-earnings-reports-and-how-read-them/','Weaver · practitioner guide'],W('Due diligence','Due_diligence')]
};
})();
