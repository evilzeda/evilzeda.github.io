/* Read-more links for every lesson: Dalio's video at the matching timestamp, central-bank explainers, classic papers, data. */
(function(){
const V=(s,lbl)=>[`Dalio video @ ${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}${lbl?' · '+lbl:''}`,`https://www.youtube.com/watch?v=PHe0bXAIuk0&t=${s}s`,'How the Economic Machine Works (YouTube)'];
const W=(t,p)=>[t,'https://en.wikipedia.org/wiki/'+p,'Wikipedia'];
const I=(t,p)=>[t,'https://www.investopedia.com/terms/'+p,'Investopedia'];
const FR=(t,s)=>[t,'https://fred.stlouisfed.org/series/'+s,'FRED · St. Louis Fed data'];
const EP=['How the Economic Machine Works (paper & site)','https://economicprinciples.org/how-the-economic-machine-works','economicprinciples.org · Ray Dalio'];
const BW=['How the Economic Machine Works (research library)','https://www.bridgewater.com/research-library/how-the-economic-machine-works','Bridgewater Associates'];
const BOE=['Money creation in the modern economy (2014)','https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy','Bank of England Quarterly Bulletin'];
const FED=['Monetary policy: what are its goals and how does it work?','https://www.federalreserve.gov/monetarypolicy.htm','Federal Reserve Board'];
const IMF=['Back to Basics: economic concepts explained','https://www.imf.org/en/Publications/fandd/issues/Series/Back-to-Basics','IMF Finance & Development'];
const BER=['Deflation: Making Sure "It" Doesn’t Happen Here (2002)','https://www.federalreserve.gov/boarddocs/speeches/2002/20021121/','Ben Bernanke · Federal Reserve'];
const TAY=['Discretion versus policy rules in practice (1993)','https://web.stanford.edu/~johntayl/Papers/Discretion.PDF','John B. Taylor · Stanford'];
const MIN=['The Financial Instability Hypothesis (1992)','https://www.levyinstitute.org/pubs/wp74.pdf','Hyman Minsky · Levy Institute WP 74'];
const RR=['This Time Is Different: Eight Centuries of Financial Folly','https://press.princeton.edu/books/paperback/9780691152646/this-time-is-different','Reinhart & Rogoff · Princeton University Press'];
ML.src={
 'transactions':[V(96,'transactions'),EP,I('Transaction','t/transaction.asp'),W('Financial transaction','Financial_transaction')],
 'total-spending':[V(106,'total spending'),I('Aggregate demand','a/aggregatedemand.asp'),W('Price','Price'),EP],
 'markets':[V(138,'markets'),I('Market','m/market.asp'),W('Market (economics)','Market_(economics)')],
 'income-loop':[V(311,'spending is income'),I('Circular flow model','c/circular-flow-model.asp'),W('Paradox of thrift','Paradox_of_thrift'),W('Circular flow of income','Circular_flow_of_income')],
 'government':[V(186,'government'),V(193,'central bank'),I('Fiscal policy','f/fiscalpolicy.asp'),I('Monetary policy','m/monetarypolicy.asp'),FED],
 'three-forces':[V(387,'productivity'),V(434,'two debt cycles'),EP,BW],
 'credit':[V(250,'credit'),V(588,'credit spends like money'),I('Credit','c/credit.asp'),W('Credit (finance)','Credit_(finance)')],
 'principal-interest':[V(250,'principal & interest'),I('Principal','p/principal.asp'),I('Amortization','a/amortization.asp'),W('Interest','Interest')],
 'debt':[V(284,'debt: asset & liability'),I('Debt','d/debt.asp'),W('Balance sheet','Balance_sheet'),BOE],
 'money-vs-credit':[V(550,'money vs credit'),EP,W('Credit theory of money','Credit_theory_of_money')],
 'creditworthiness':[V(346,'creditworthiness'),I('Creditworthiness','c/credit-worthiness.asp'),I('Debt-to-income ratio','d/dti.asp'),I('Loan-to-value ratio','l/loantovalue.asp')],
 'productive-credit':[V(623,'productive credit'),EP,W('Productive and unproductive credit','Credit_(finance)')],
 'compounding':[V(920,'debt burden'),I('Compound interest','c/compoundinterest.asp'),I('Rule of 72','r/ruleof72.asp'),FR('US household debt service ratio (TDSP)','TDSP')],
 'what-is-money':[I('Money','m/money.asp'),W('Money','Money'),W('Fiat money','Fiat_money'),BOE],
 'bank-money':[BOE,I('Fractional reserve banking','f/fractionalreservebanking.asp'),W('Money multiplier','Money_multiplier'),W('Money creation','Money_creation')],
 'money-supply':[I('Money supply','m/moneysupply.asp'),FR('M2 money stock (M2SL)','M2SL'),FR('Monetary base (BOGMBASE)','BOGMBASE'),W('Money supply','Money_supply')],
 'quantity-theory':[I('Quantity theory of money','q/quantity_theory_of_money.asp'),I('Velocity of money','v/velocity.asp'),W('Equation of exchange','Equation_of_exchange'),FR('Velocity of M2 (M2V)','M2V')],
 'bonds-yields':[I('Bond','b/bond.asp'),I('Yield','y/yield.asp'),W('Bond valuation','Bond_valuation'),FR('10-year Treasury yield (DGS10)','DGS10')],
 'yield-curve':[I('Yield curve','y/yieldcurve.asp'),FR('10y minus 2y Treasury spread (T10Y2Y)','T10Y2Y'),FR('10y minus 3m spread (T10Y3M)','T10Y3M'),W('Yield curve','Yield_curve')],
 'policy-rate':[V(761,'interest rates'),FED,W('Monetary transmission mechanism','Monetary_transmission_mechanism'),FR('Effective federal funds rate (FEDFUNDS)','FEDFUNDS')],
 'real-rates':[I('Real interest rate','r/realinterestrate.asp'),W('Fisher equation','Fisher_equation'),I('Nominal interest rate','n/nominalinterestrate.asp')],
 'inflation':[V(734,'inflation'),I('Inflation','i/inflation.asp'),FR('Consumer price index (CPIAUCSL)','CPIAUCSL'),IMF],
 'deflation':[V(787,'deflation'),BER,W('Debt deflation (Irving Fisher, 1933)','Debt_deflation'),I('Deflation','d/deflation.asp')],
 'taylor-rule':[TAY,I('Taylor’s rule','t/taylorsrule.asp'),W('Taylor rule','Taylor_rule'),W('Phillips curve','Phillips_curve')],
 'asset-prices':[V(887,'assets & bubbles'),I('Present value','p/presentvalue.asp'),I('Wealth effect','w/wealtheffect.asp'),W('Dividend discount model','Dividend_discount_model')],
 'zero-bound':[V(1084,'rates at zero'),W('Zero lower bound','Zero_lower_bound'),W('Liquidity trap','Liquidity_trap'),I('Quantitative easing','q/quantitative-easing.asp')],
 'productivity':[V(387,'productivity'),I('Productivity','p/productivity.asp'),W('Total factor productivity','Total_factor_productivity'),FR('US output per hour (OPHNFB)','OPHNFB')],
 'short-cycle':[V(830,'short-term debt cycle'),I('Business cycle','b/businesscycle.asp'),W('Business cycle','Business_cycle'),EP],
 'recession':[V(787,'recession'),I('Recession','r/recession.asp'),['US business cycle dating','https://www.nber.org/research/business-cycle-dating','NBER'],FR('Unemployment rate (UNRATE)','UNRATE')],
 'long-cycle':[V(855,'long-term debt cycle'),EP,BW,RR],
 'debt-burden':[V(920,'debt burden'),FR('Household debt service ratio (TDSP)','TDSP'),FR('Federal debt to GDP (GFDEGDQ188S)','GFDEGDQ188S'),W('Debt-to-GDP ratio','Debt-to-GDP_ratio')],
 'bubble':[V(887,'bubbles'),MIN,W('Economic bubble','Economic_bubble'),W('Minsky moment','Minsky_moment')],
 'debt-peak':[V(955,'long-term debt peak'),RR,W('Great Depression','Great_Depression'),W('Japanese asset price bubble','Japanese_asset_price_bubble')],
 'deleveraging':[V(1084,'deleveraging'),V(1150,'four ways'),EP,I('Deleverage','d/deleverage.asp')],
 'austerity':[V(1185,'spending cuts'),I('Austerity','a/austerity.asp'),W('Paradox of thrift','Paradox_of_thrift'),W('Greek government-debt crisis','Greek_government-debt_crisis')],
 'debt-reduction':[V(1234,'debt reduction'),I('Debt restructuring','d/debtrestructuring.asp'),W('Bank run','Bank_run'),['Deposit insurance (FDIC)','https://www.fdic.gov/resources/deposit-insurance','FDIC']],
 'redistribution':[V(1340,'wealth redistribution'),W('Redistribution of income and wealth','Redistribution_of_income_and_wealth'),W('Fiscal multiplier','Fiscal_multiplier')],
 'printing':[V(1479,'printing money'),I('Quantitative easing','q/quantitative-easing.asp'),W('Helicopter money','Helicopter_money'),W('Hyperinflation in the Weimar Republic','Hyperinflation_in_the_Weimar_Republic')],
 'beautiful':[V(1561,'beautiful deleveraging'),EP,BW,W('Great Recession','Great_Recession')],
 'growth-vs-rate':[V(1658,'income growth vs interest rate'),W('Financial repression','Financial_repression'),EP],
 'lost-decade':[V(1765,'lost decade'),W('Lost Decades (Japan)','Lost_Decades'),FR('US real GDP (GDPC1)','GDPC1'),RR],
 'three-rules':[V(1785,'three rules of thumb'),EP,BW,['Principles for Navigating Big Debt Crises','https://economicprinciples.org/','Ray Dalio · economicprinciples.org']],
 'crisis-timeline':[RR,W('Manias, Panics, and Crashes (Kindleberger)','Manias,_Panics,_and_Crashes'),W('List of economic crises','List_of_economic_crises'),['Federal Reserve History: essays on every major US crisis','https://www.federalreservehistory.org/essays','Federal Reserve History']],
 'first-crisis':[W('Financial crisis of 33','Financial_crisis_of_33'),['The Roman Financial Crisis of A.D. 33','https://www.npr.org/transcripts/792386687','NPR Planet Money · The Indicator'],['The Financial Crisis, Then and Now: Ancient Rome and 2008','https://epicenter.wcfia.harvard.edu/blog/financial-crisis-then-and-now','Harvard Weatherhead Center'],['The Business Panic of 33 A.D. (Tenney Frank, retold)','https://en.wikisource.org/wiki/The_Influence_of_Wealth_in_Imperial_Rome/The_Business_Panic_of_33_A.D.','Wikisource']],
 'tulip-mania':[W('Tulip mania','Tulip_mania'),['Tulipmania: Money, Honor, and Knowledge in the Dutch Golden Age (excerpt)','https://press.uchicago.edu/Misc/Chicago/301259.html','Anne Goldgar · University of Chicago Press'],['Review of Goldgar’s Tulipmania','https://reviews.history.ac.uk/review/666','Reviews in History · Institute of Historical Research']],
 'south-sea':[['The South Sea Bubble of 1720','https://blog.nationalarchives.gov.uk/the-south-sea-bubble-of-1720','The National Archives (UK)'],['South Sea Bubble','https://www.britannica.com/event/South-Sea-Bubble','Encyclopaedia Britannica'],['South Sea Bubble 1720 project','https://som.yale.edu/blog/looking-back-300-years-at-the-south-sea-bubble-of-1720','Yale School of Management · ICF'],W('Mississippi Company','Mississippi_Company')],
 'bank-panics':[['Lombard Street: A Description of the Money Market (1873)','https://www.gutenberg.org/ebooks/4359','Walter Bagehot · Project Gutenberg'],['The Panic of 1907','https://www.federalreservehistory.org/essays/panic-of-1907','Federal Reserve History'],W('Panic of 1825','Panic_of_1825'),W('Overend, Gurney and Company','Overend,_Gurney_and_Company')],
 'great-depression':[['The Great Depression: an overview (Wheelock)','https://www.stlouisfed.org/~/media/Files/PDFs/Great-Depression/the-great-depression-wheelock-overview.pdf','Federal Reserve Bank of St. Louis'],['A Monetary History of the US: The Great Contraction (ch. 7)','https://www.nber.org/system/files/chapters/c9274/c9274.pdf','Friedman & Schwartz · NBER'],['Remarks on Milton Friedman’s 90th birthday (2002)','https://www.federalreserve.gov/boarddocs/speeches/2002/20021108/','Ben Bernanke · Federal Reserve'],V(1600,'1930s example')],
 'em-crises':[['Latin American Debt Crisis of the 1980s','https://www.federalreservehistory.org/essays/latin-american-debt-crisis','Federal Reserve History'],['Asian Financial Crisis','https://www.federalreservehistory.org/essays/asian-financial-crisis','Federal Reserve History'],['IMF and Indonesia’s 1997–98 crisis (IEO evaluation)','https://www.imf.org/external/np/ieo/2003/cac/pdf/Ind.pdf','IMF Independent Evaluation Office'],W('1997 Asian financial crisis','1997_Asian_financial_crisis')],
 'gfc-2008':[['The Financial Crisis Inquiry Report (2011)','https://www.govinfo.gov/app/details/GPO-FCIC','US Financial Crisis Inquiry Commission'],['Subprime Mortgage Crisis','https://www.federalreservehistory.org/essays/subprime-mortgage-crisis','Federal Reserve History'],FR('S&P/Case-Shiller US National Home Price Index','CSUSHPINSA'),W('Collapse of Silicon Valley Bank','Collapse_of_Silicon_Valley_Bank')],
 'crisis-pattern':[MIN,W('Manias, Panics, and Crashes (Kindleberger)','Manias,_Panics,_and_Crashes'),RR,W('Minsky moment','Minsky_moment')],
 'reserve-currency':[I('Reserve currency','r/reservecurrency.asp'),W('Reserve currency','Reserve_currency'),['The Changing World Order (Ray Dalio)','https://www.economicprinciples.org/','economicprinciples.org · book & video']],
 'rise-of-dollar':[['Exorbitant Privilege: The Rise and Fall of the Dollar','https://global.oup.com/academic/product/exorbitant-privilege-9780199931095','Barry Eichengreen · Oxford University Press'],['Federal Reserve Act','https://www.federalreservehistory.org/essays/federal-reserve-act-signed','Federal Reserve History'],W('Pound sterling as a reserve currency','Pound_sterling')],
 'bretton-woods':[['Creation of the Bretton Woods System','https://www.federalreservehistory.org/essays/bretton-woods-created','Federal Reserve History'],['Nixon Ends Convertibility of US Dollars to Gold','https://www.federalreservehistory.org/essays/gold-convertibility-ends','Federal Reserve History'],['The Bretton Woods System','https://www.gold.org/history-gold/bretton-woods-system','World Gold Council'],W('Triffin dilemma','Triffin_dilemma')],
 'petrodollar':[I('Petrodollar','p/petrodollars.asp'),W('Petrodollar recycling','Petrodollar_recycling'),W('1973 oil crisis','1973_oil_crisis')],
 'why-dollar':[['IMF Data Brief: COFER, 2025 Q3','https://data.imf.org/en/news/imf-data-brief-december-19','IMF data'],['Dollar’s share of reserves held steady in Q2 2025 when adjusted for FX moves','https://www.imf.org/en/Blogs/Articles/2025/10/01/dollars-share-of-reserves-held-steady-in-second-quarter-when-adjusted-for-fx-moves','IMF Blog'],['Triennial Survey 2025: global FX trading hits $9.6 trillion a day','https://www.bis.org/press/p250930.htm','Bank for International Settlements'],['The International Role of the US Dollar','https://www.federalreserve.gov/econres/notes/feds-notes/the-international-role-of-the-u-s-dollar-2025-edition-20250718.html','Federal Reserve · FEDS Notes']],
 'exorbitant-privilege':[['Exorbitant Privilege (Eichengreen)','https://global.oup.com/academic/product/exorbitant-privilege-9780199931095','Oxford University Press'],W('Exorbitant privilege','Exorbitant_privilege'),['Central bank liquidity swaps','https://www.federalreserve.gov/monetarypolicy/central-bank-liquidity-swaps.htm','Federal Reserve Board'],['The Global Dollar Cycle (Obstfeld & Zhou)','https://www.brookings.edu/articles/the-global-dollar-cycle/','Brookings Papers on Economic Activity, 2022']]
};
})();
