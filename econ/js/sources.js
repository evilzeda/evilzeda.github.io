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
 'three-rules':[V(1785,'three rules of thumb'),EP,BW,['Principles for Navigating Big Debt Crises','https://economicprinciples.org/','Ray Dalio · economicprinciples.org']]
};
})();
