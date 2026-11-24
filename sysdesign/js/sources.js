/* Further reading for every lesson. The original designed-to-scale lesson is added automatically by the engine.
   Format: [title, url, publisher] */
(function(){
const W=(t,slug)=>[t,'https://en.wikipedia.org/wiki/'+slug,'Wikipedia'];
const SRE=(t,slug)=>[t,'https://sre.google/sre-book/'+slug+'/','Google SRE book'];
const PRIMER=['The System Design Primer','https://github.com/donnemartin/system-design-primer','Donne Martin · GitHub'];
const OWASP=(t,f)=>[t,'https://cheatsheetseries.owasp.org/cheatsheets/'+f+'.html','OWASP Cheat Sheet Series'];
const MF=(t,path)=>[t,'https://martinfowler.com/'+path,'martinfowler.com'];
SD.src={
  'request-lifecycle':[
    ['What is DNS? How a lookup travels','https://www.cloudflare.com/learning/dns/what-is-dns/','Cloudflare Learning Center'],
    W('Transmission Control Protocol (handshake)','Transmission_Control_Protocol'),
    W('Transport Layer Security (TLS)','Transport_Layer_Security')],
  'latency-throughput':[
    SRE('Monitoring Distributed Systems: the four golden signals','monitoring-distributed-systems'),
    W('Queueing theory','Queueing_theory'),
    W("Little's law",'Little%27s_law')],
  'napkin-math':[
    PRIMER,
    W('Back-of-the-envelope calculation','Back-of-the-envelope_calculation')],
  'vertical-horizontal':[
    W('Scalability: horizontal and vertical scaling','Scalability'),
    PRIMER],
  'load-balancing':[
    SRE('Load Balancing in the Datacenter','load-balancing-datacenter'),
    SRE('Load Balancing at the Frontend','load-balancing-frontend'),
    W('Load balancing (computing)','Load_balancing_(computing)')],
  'stateless':[
    ['The Twelve-Factor App: VI. Processes (stateless)','https://12factor.net/processes','12factor.net'],
    W('Session (computer science)','Session_(computer_science)')],
  'caching':[
    W('Cache (computing)','Cache_(computing)'),
    W('Cache stampede','Cache_stampede'),
    PRIMER],
  'cdn':[
    ['What is a CDN?','https://www.cloudflare.com/learning/cdn/what-is-a-cdn/','Cloudflare Learning Center'],
    W('Content delivery network','Content_delivery_network')],
  'sql-nosql':[
    W('NoSQL','NoSQL'),
    W('Relational database','Relational_database'),
    PRIMER],
  'indexes':[
    ['Anatomy of an SQL Index: the B-tree','https://use-the-index-luke.com/sql/anatomy','Use The Index, Luke · Markus Winand'],
    W('B-tree','B-tree')],
  'storage-engines':[
    W('Log-structured merge-tree','Log-structured_merge-tree'),
    W('Write-ahead logging','Write-ahead_logging'),
    W('B-tree','B-tree')],
  'replication':[
    W('Replication (computing)','Replication_(computing)'),
    W('Eventual consistency','Eventual_consistency')],
  'sharding':[
    W('Shard (database architecture)','Shard_(database_architecture)'),
    PRIMER],
  'consistent-hashing':[
    W('Consistent hashing','Consistent_hashing')],
  'unique-ids':[
    ['Announcing Snowflake','https://blog.x.com/engineering/en_us/a/2010/announcing-snowflake','X (Twitter) Engineering'],
    W('Snowflake ID','Snowflake_ID'),
    W('Universally unique identifier (UUID)','Universally_unique_identifier')],
  'cap':[
    W('CAP theorem','CAP_theorem'),
    W('Eventual consistency','Eventual_consistency'),
    W('Quorum (distributed computing)','Quorum_(distributed_computing)')],
  'consensus':[
    ['The Raft Consensus Algorithm (paper, visualisation)','https://raft.github.io/','raft.github.io'],
    SRE('Managing Critical State: Distributed Consensus','managing-critical-state')],
  'transactions':[
    ['Transaction Isolation','https://www.postgresql.org/docs/current/transaction-iso.html','PostgreSQL documentation'],
    W('ACID','ACID')],
  'files':[
    W('Object storage','Object_storage'),
    W('Content delivery network','Content_delivery_network')],
  'apis':[
    W('REST','REST'),
    ['Learn GraphQL','https://graphql.org/learn/','graphql.org'],
    ['Introduction to gRPC','https://grpc.io/docs/what-is-grpc/introduction/','grpc.io']],
  'queues':[
    W('Message queue','Message_queue'),
    PRIMER],
  'pubsub':[
    ['Apache Kafka: introduction (topics, partitions, consumer groups)','https://kafka.apache.org/documentation/#introduction','Apache Kafka docs'],
    W('Publish–subscribe pattern','Publish%E2%80%93subscribe_pattern')],
  'realtime':[
    ['The WebSocket API','https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API','MDN Web Docs'],
    ['Using server-sent events','https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events','MDN Web Docs']],
  'redundancy':[
    W('High availability','High_availability'),
    SRE('Addressing Cascading Failures','addressing-cascading-failures')],
  'rate-limiting':[
    SRE('Handling Overload','handling-overload'),
    W('Token bucket','Token_bucket')],
  'timeouts-retries':[
    ['Timeouts, retries, and backoff with jitter','https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/','Amazon Builders’ Library'],
    SRE('Addressing Cascading Failures','addressing-cascading-failures'),
    W('Circuit breaker design pattern','Circuit_breaker_design_pattern')],
  'observability':[
    SRE('Monitoring Distributed Systems','monitoring-distributed-systems'),
    SRE('Service Level Objectives','service-level-objectives')],
  'microservices':[
    MF('Microservices (Lewis & Fowler)','articles/microservices.html'),
    MF('Microservice Trade-Offs','articles/microservice-trade-offs.html')],
  'service-discovery':[
    W('Service discovery','Service_discovery'),
    MF('Microservices (Lewis & Fowler)','articles/microservices.html')],
  'sagas':[
    ['Pattern: Saga','https://microservices.io/patterns/data/saga.html','microservices.io · Chris Richardson'],
    ['Saga distributed transactions pattern','https://learn.microsoft.com/en-us/azure/architecture/patterns/saga','Microsoft Azure Architecture Center']],
  'batch-stream':[
    W('Stream processing','Stream_processing'),
    W('Batch processing','Batch_processing'),
    ['Apache Kafka: introduction','https://kafka.apache.org/documentation/#introduction','Apache Kafka docs']],
  'authentication':[
    OWASP('Password Storage Cheat Sheet','Password_Storage_Cheat_Sheet'),
    OWASP('Authentication Cheat Sheet','Authentication_Cheat_Sheet'),
    W('OpenID Connect','OpenID_Connect')],
  'authorization':[
    OWASP('Insecure Direct Object Reference Prevention','Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet'),
    OWASP('Authorization Cheat Sheet','Authorization_Cheat_Sheet'),
    W('Role-based access control','Role-based_access_control')],
  'encryption':[
    W('Transport Layer Security','Transport_Layer_Security'),
    OWASP('Secrets Management Cheat Sheet','Secrets_Management_Cheat_Sheet'),
    OWASP('Cryptographic Storage Cheat Sheet','Cryptographic_Storage_Cheat_Sheet')],
  'testing':[
    MF('The Practical Test Pyramid','articles/practical-test-pyramid.html'),
    MF('Test Pyramid (bliki)','bliki/TestPyramid.html')],
  'cicd':[
    MF('Continuous Integration','articles/continuousIntegration.html'),
    MF('Canary Release','bliki/CanaryRelease.html'),
    MF('Feature Toggles','articles/feature-toggles.html')],
  'hld-lld':[
    PRIMER,
    W('Systems design','Systems_design')],
  'design-url-shortener':[
    W('URL shortening','URL_shortening'),
    PRIMER],
  'design-news-feed':[
    PRIMER,
    W('News feed','News_feed')],
  'design-content-check':[
    ['How Content ID works','https://support.google.com/youtube/answer/2797370','YouTube Help'],
    ['Learn about Content ID claims (block, monetise, track)','https://support.google.com/youtube/answer/6013276','YouTube Help'],
    ['An Industrial-Strength Audio Search Algorithm (Shazam paper)','https://www.princeton.edu/~cuff/ele201/files/Wang03-shazam.pdf','Avery Wang · ISMIR 2003'],
    W('Acoustic fingerprint','Acoustic_fingerprint'),
    ['PDQ & TMK+PDQF: open-source image and video hashing','https://github.com/facebook/ThreatExchange','Meta · GitHub']],
  'design-chat':[
    ['The WebSocket API','https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API','MDN Web Docs'],
    W('Instant messaging','Instant_messaging'),
    PRIMER]
};
})();

/* Steps where the arrows happen at the same time (fan-out, broadcast, spread) rather than in order. 1-based. */
(function(){
const PAR={
  'latency-throughput':[6,7],
  'vertical-horizontal':[6,7,8],
  'load-balancing':[5,9],
  'stateless':[6,8],
  'cdn':[4,7,8],
  'replication':[3,6,8],
  'sharding':[2,5,6,7],
  'consistent-hashing':[3,4,7],
  'cap':[1,7],
  'consensus':[7],
  'pubsub':[2,3,4,7],
  'queues':[5],
  'redundancy':[4,6,8],
  'observability':[2,6],
  'microservices':[3,4,6,7],
  'service-discovery':[4,5,6],
  'batch-stream':[6],
  'authorization':[6],
  'encryption':[7],
  'testing':[8]
};
for(const id in PAR){const L=SD.LESSONS[id];if(!L)continue;PAR[id].forEach(n=>{if(L.steps[n-1])L.steps[n-1].par=1})}
})();
