const mysql = require('../backend/node_modules/mysql2/promise');

// 33 Telangana Districts
const tgDistricts = [
  { id: 31, name: 'ఆదిలాబాద్ జిల్లా-Adilabad', state_id: 2 },
  { id: 32, name: 'భద్రాద్రి కొత్తగూడెం జిల్లా-Bhadradri Kothagudem', state_id: 2 },
  { id: 33, name: 'హనుమకొండ జిల్లా-Hanumakonda', state_id: 2 },
  { id: 34, name: 'హైదరాబాద్ జిల్లా-Hyderabad', state_id: 2 },
  { id: 35, name: 'జగిత్యాల జిల్లా-Jagtial', state_id: 2 },
  { id: 36, name: 'జనగాం జిల్లా-Jangaon', state_id: 2 },
  { id: 37, name: 'జయశంకర్ భూపాలపల్లి జిల్లా-Jayashankar Bhupalpally', state_id: 2 },
  { id: 38, name: 'జోగులాంబ గద్వాల జిల్లా-Jogulamba Gadwal', state_id: 2 },
  { id: 39, name: 'కామారెడ్డి జిల్లా-Kamareddy', state_id: 2 },
  { id: 40, name: 'కరీంనగర్ జిల్లా-Karimnagar', state_id: 2 },
  { id: 41, name: 'ఖమ్మం జిల్లా-Khammam', state_id: 2 },
  { id: 42, name: 'కొమరం భీమ్ ఆసిఫాబాద్ జిల్లా-Kumuram Bheem Asifabad', state_id: 2 },
  { id: 43, name: 'మహబూబాబాద్ జిల్లా-Mahabubabad', state_id: 2 },
  { id: 44, name: 'మహబూబ్ నగర్ జిల్లా-Mahabubnagar', state_id: 2 },
  { id: 45, name: 'మంచిర్యాల జిల్లా-Mancherial', state_id: 2 },
  { id: 46, name: 'మెదక్ జిల్లా-Medak', state_id: 2 },
  { id: 47, name: 'మేడ్చల్-మల్కాజ్ గిరి జిల్లా-Medchal Malkajgiri', state_id: 2 },
  { id: 48, name: 'ములుగు జిల్లా-Mulugu', state_id: 2 },
  { id: 49, name: 'నాగర్ కర్నూల్ జిల్లా-Nagarkurnool', state_id: 2 },
  { id: 50, name: 'నల్గొండ జిల్లా-Nalgonda', state_id: 2 },
  { id: 51, name: 'నారాయణపేట జిల్లా-Narayanpet', state_id: 2 },
  { id: 52, name: 'నిర్మల్ జిల్లా-Nirmal', state_id: 2 },
  { id: 53, name: 'నిజామాబాద్ జిల్లా-Nizamabad', state_id: 2 },
  { id: 54, name: 'పెద్దపల్లి జిల్లా-Peddapalli', state_id: 2 },
  { id: 55, name: 'రాజన్న సిరిసిల్ల జిల్లా-Rajanna Sircilla', state_id: 2 },
  { id: 56, name: 'రంగారెడ్డి జిల్లా-Ranga Reddy', state_id: 2 },
  { id: 57, name: 'సంగారెడ్డి జిల్లా-Sangareddy', state_id: 2 },
  { id: 58, name: 'సిద్దిపేట జిల్లా-Siddipet', state_id: 2 },
  { id: 59, name: 'సూర్యాపేట జిల్లా-Suryapet', state_id: 2 },
  { id: 60, name: 'వికారాబాద్ జిల్లా-Vikarabad', state_id: 2 },
  { id: 61, name: 'వనపర్తి జిల్లా-Wanaparthy', state_id: 2 },
  { id: 62, name: 'వరంగల్ జిల్లా-Warangal', state_id: 2 },
  { id: 63, name: 'యాదాద్రి భువనగిరి జిల్లా-Yadadri Bhuvanagiri', state_id: 2 }
];

// 119 Telangana Assembly Constituencies mapped to districts
// Each has: id (1001-1119), name, dstrct_id, and array of mandals
const tgConstituencies = [
  // Adilabad (31)
  { id: 1001, name: 'ఆదిలాబాద్-Adilabad', dstrct_id: 31, mandals: ['Adilabad Urban', 'Adilabad Rural', 'Mavala', 'Gudihatnoor', 'Bazarhathnoor', 'Bela', 'Boinpalli', 'Jainad'] },
  { id: 1002, name: 'బోథ్-Boath', dstrct_id: 31, mandals: ['Boath', 'Neradigonda', 'Ichoda', 'Tamsi', 'Talamadugu', 'Bazarhathnoor'] },

  // Kumuram Bheem Asifabad (42)
  { id: 1003, name: 'సిర్పూర్-Sirpur', dstrct_id: 42, mandals: ['Sirpur (T)', 'Kouthala', 'Bejjur', 'Dahegaon', 'Kagaznagar', 'Penchikalpet', 'Chintalamanepally'] },
  { id: 1004, name: 'ఆసిఫాబాద్-Asifabad', dstrct_id: 42, mandals: ['Asifabad', 'Kerameri', 'Wankidi', 'Rebbena', 'Tiryani', 'Jainoor', 'Narnoor', 'Lingapur'] },

  // Mancherial (45)
  { id: 1005, name: 'చెన్నూర్-Chennur', dstrct_id: 45, mandals: ['Chennur', 'Kotapally', 'Jaipur', 'Mandamarri', 'Bheemaram'] },
  { id: 1006, name: 'బెల్లంపల్లి-Bellampalli', dstrct_id: 45, mandals: ['Bellampalli', 'Nennal', 'Tandur', 'Kasipet', 'Vemanpalli', 'Kannepalli'] },
  { id: 1007, name: 'మంచిర్యాల-Mancherial', dstrct_id: 45, mandals: ['Mancherial', 'Dandepally', 'Luxettipet', 'Hajipur', 'Naspur'] },

  // Nirmal (52)
  { id: 1008, name: 'ముధోల్-Mudhole', dstrct_id: 52, mandals: ['Mudhole', 'Kuntala', 'Kubeer', 'Bhainsa', 'Tanur', 'Basar', 'Lokeswaram'] },
  { id: 1009, name: 'నిర్మల్-Nirmal', dstrct_id: 52, mandals: ['Nirmal Urban', 'Nirmal Rural', 'Dilawarpur', 'Mamda', 'Soan', 'Laxmanchanda', 'Sarangapur'] },
  { id: 1010, name: 'ఖానాపూర్-Khanapur', dstrct_id: 52, mandals: ['Khanapur', 'Kaddam (Peddur)', 'Dasturabad', 'Pembi', 'Jannaram'] },

  // Nizamabad (53)
  { id: 1011, name: 'ఆర్మూర్-Armoor', dstrct_id: 53, mandals: ['Armoor', 'Nandipet', 'Makloor'] },
  { id: 1012, name: 'బోధన్-Bodhan', dstrct_id: 53, mandals: ['Bodhan', 'Ranjal', 'Navipet', 'Yedapally', 'Kotgiri', 'Rudrur'] },
  { id: 1013, name: 'నిజామాబాద్ అర్బన్-Nizamabad Urban', dstrct_id: 53, mandals: ['Nizamabad North', 'Nizamabad South'] },
  { id: 1014, name: 'నిజామాబాద్ రూరల్-Nizamabad Rural', dstrct_id: 53, mandals: ['Nizamabad Rural', 'Jakranpally', 'Sirkonda', 'Dichpally', 'Dharpally', 'Indalwai', 'Mugpal'] },
  { id: 1015, name: 'బాల్కొండ-Balkonda', dstrct_id: 53, mandals: ['Balkonda', 'Mortad', 'Kammarpally', 'Velpur', 'Yerugatla', 'Bheemgal', 'Mupkal'] },

  // Kamareddy (39)
  { id: 1016, name: 'జుక్కల్-Jukkal', dstrct_id: 39, mandals: ['Jukkal', 'Madnoor', 'Bichkunda', 'Pitlam', 'Nizamsagar', 'Pedda Kodapgal', 'Dongli'] },
  { id: 1017, name: 'బాన్సువాడ-Banswada', dstrct_id: 39, mandals: ['Banswada', 'Birkoor', 'Varni', 'Kotgiri', 'Rudrur', 'Chandur', 'Mosra', 'Nasrullabad'] },
  { id: 1018, name: 'ఎల్లారెడ్డి-Yellareddy', dstrct_id: 39, mandals: ['Yellareddy', 'Nagireddypet', 'Lingampet', 'Tadwai', 'Gandhari', 'Sadasivanagar', 'Ramareddy'] },
  { id: 1019, name: 'కామారెడ్డి-Kamareddy', dstrct_id: 39, mandals: ['Kamareddy', 'Bhiknoor', 'Domakonda', 'Machareddy', 'Bibipet', 'Rajampet'] },

  // Karimnagar (40)
  { id: 1020, name: 'కరీంనగర్-Karimnagar', dstrct_id: 40, mandals: ['Karimnagar Urban', 'Karimnagar Rural', 'Kothapalli'] },
  { id: 1021, name: 'చొప్పదండి-Choppadandi', dstrct_id: 40, mandals: ['Choppadandi', 'Boinpalli', 'Gangadhara', 'Ramadugu', 'Mallial', 'Pegadapalli'] },
  { id: 1022, name: 'మానకొండూర్-Manakondur', dstrct_id: 40, mandals: ['Manakondur', 'Ellanthakunta', 'Thimmapur', 'Shankarapatnam', 'Chigurumamidi', 'Saidapur'] },
  { id: 1023, name: 'హుజూరాబాద్-Huzurabad', dstrct_id: 40, mandals: ['Huzurabad', 'Veenavanka', 'Jammikunta', 'Kamalapur', 'Illanthakunta'] },

  // Jagtial (35)
  { id: 1024, name: 'కోరుట్ల-Koratla', dstrct_id: 35, mandals: ['Koratla', 'Metpally', 'Mallapur', 'Ibrahimpatnam'] },
  { id: 1025, name: 'జగిత్యాల-Jagtial', dstrct_id: 35, mandals: ['Jagtial Urban', 'Jagtial Rural', 'Raikal', 'Sarangapur', 'Beerpur'] },
  { id: 1026, name: 'ధర్మపురి-Dharmapuri', dstrct_id: 35, mandals: ['Dharmapuri', 'Gollapalli', 'Velgatoor', 'Pegadapalli', 'Buggaram'] },

  // Peddapalli (54)
  { id: 1027, name: 'రామగుండం-Ramagundam', dstrct_id: 54, mandals: ['Ramagundam', 'Antargaon', 'Palakurthi'] },
  { id: 1028, name: 'మంథని-Manthani', dstrct_id: 54, mandals: ['Manthani', 'Kamanpur', 'Mutharam', 'Ramagiri', 'Malharrao', 'Kataram', 'Mahadevpur'] },
  { id: 1029, name: 'పెద్దపల్లి-Peddapalli', dstrct_id: 54, mandals: ['Peddapalli', 'Odela', 'Sultanabad', 'Julapalli', 'Eligaid', 'Dharmaram'] },

  // Rajanna Sircilla (55)
  { id: 1030, name: 'వేములవాడ-Vemulawada', dstrct_id: 55, mandals: ['Vemulawada', 'Vemulawada Rural', 'Konaraopet', 'Chandurthi', 'Medipalle', 'Boinpalli', 'Rudrangi'] },
  { id: 1031, name: 'సిరిసిల్ల-Sircilla', dstrct_id: 55, mandals: ['Sircilla', 'Thangallapalli', 'Gambhiraopet', 'Yellareddypet', 'Veernapalli', 'Mustabad'] },

  // Medak (46)
  { id: 1032, name: 'మెదక్-Medak', dstrct_id: 46, mandals: ['Medak', 'Haveli Ghanpur', 'Shankarampet (R)', 'Papannapet', 'Ramayampet', 'Nizampet', 'Yeldurthy', 'Chegunta'] },
  { id: 1033, name: 'నర్సాపూర్-Narsapur', dstrct_id: 46, mandals: ['Narsapur', 'Kulcharam', 'Shivampet', 'Kowdipalle', 'Chilipched', 'Hathnoora'] },

  // Sangareddy (57)
  { id: 1034, name: 'నారాయణఖేడ్-Narayankhed', dstrct_id: 57, mandals: ['Narayankhed', 'Kangti', 'Manoor', 'Kalher', 'Sirgapoor', 'Nagalgidda'] },
  { id: 1035, name: 'ఆందోల్-Andole', dstrct_id: 57, mandals: ['Andole', 'Jogipet', 'Tekmal', 'Alladurg', 'Regode', 'Raikode', 'Munipally', 'Pulkal', 'Choutakur'] },
  { id: 1036, name: 'జహీరాబాద్-Zahirabad', dstrct_id: 57, mandals: ['Zahirabad', 'Kohir', 'Nyalkal', 'Jharasangam', 'Mogudampally'] },
  { id: 1037, name: 'సంగారెడ్డి-Sangareddy', dstrct_id: 57, mandals: ['Sangareddy', 'Kandi', 'Kondapur', 'Sadasivpet'] },
  { id: 1038, name: 'పటాన్ చెరు-Patancheru', dstrct_id: 57, mandals: ['Patancheru', 'Ameenpur', 'Gummadidala', 'Jinnaram', 'Ramachandrapuram', 'Bharathinagar'] },

  // Siddipet (58)
  { id: 1039, name: 'సిద్దిపేట-Siddipet', dstrct_id: 58, mandals: ['Siddipet Urban', 'Siddipet Rural', 'Nanganur', 'Chinnakodur', 'Narayanraopet'] },
  { id: 1040, name: 'దుబ్బాక-Dubbak', dstrct_id: 58, mandals: ['Dubbak', 'Mirdoddi', 'Doultabad', 'Chegunta', 'Thoguta', 'Rayapol'] },
  { id: 1041, name: 'గజ్వేల్-Gajwel', dstrct_id: 58, mandals: ['Gajwel', 'Toopran', 'Jagdevpur', 'Wargal', 'Mulug', 'Markook'] },
  { id: 1042, name: 'హుస్నాబాద్-Husnabad', dstrct_id: 58, mandals: ['Husnabad', 'Akkannapet', 'Koheda', 'Maddur', 'Bejjanki', 'Saidapur', 'Dhoolmitta'] },

  // Jangaon (36)
  { id: 1043, name: 'జనగాం-Jangaon', dstrct_id: 36, mandals: ['Jangaon', 'Tharigoppula', 'Bachannapet', 'Narmetta', 'Maddur', 'Devaruppula'] },
  { id: 1044, name: 'స్టేషన్ ఘన్ పూర్-Station Ghanpur', dstrct_id: 36, mandals: ['Station Ghanpur', 'Dharmasagar', 'Raghunathpally', 'Zaffergadh', 'Chilpur'] },
  { id: 1045, name: 'పాలకుర్తి-Palakurthi', dstrct_id: 36, mandals: ['Palakurthi', 'Devaruppula', 'Kodakandla', 'Raiparthy', 'Thorrur'] },

  // Hanumakonda (33)
  { id: 1046, name: 'వరంగల్ పశ్చిమ-Warangal West', dstrct_id: 33, mandals: ['Hanumakonda', 'Kazipet'] },
  { id: 1047, name: 'పరకాల-Parkal', dstrct_id: 33, mandals: ['Parkal', 'Atmakur', 'Shayampet', 'Geesugonda', 'Sangem', 'Nadikuda', 'Damera'] },

  // Warangal (62)
  { id: 1048, name: 'వరంగల్ తూర్పు-Warangal East', dstrct_id: 62, mandals: ['Warangal', 'Khila Warangal'] },
  { id: 1049, name: 'వర్ధన్నపేట-Wardhannapet', dstrct_id: 62, mandals: ['Wardhannapet', 'Inavolu', 'Hasanparthy', 'Raiparthy'] },
  { id: 1050, name: 'నర్సంపేట-Narsampet', dstrct_id: 62, mandals: ['Narsampet', 'Chennaraopet', 'Duggondi', 'Khanapur', 'Nekkonda', 'Nallabelly'] },

  // Jayashankar Bhupalpally (37)
  { id: 1051, name: 'భూపాలపల్లి-Bhupalpalle', dstrct_id: 37, mandals: ['Bhupalpally', 'Ghanpur', 'Regonda', 'Mogullapally', 'Chityal', 'Tekumatla', 'Malharrao'] },

  // Mulugu (48)
  { id: 1052, name: 'ములుగు-Mulug', dstrct_id: 48, mandals: ['Mulug', 'Venkatapur', 'Govindaraopet', 'Tadvai', 'Eturnagaram', 'Mangapet', 'Kannaigudem', 'Wazeed', 'Venkatapuram'] },

  // Mahabubabad (43)
  { id: 1053, name: 'మహబూబాబాద్-Mahabubabad', dstrct_id: 43, mandals: ['Mahabubabad', 'Kuravi', 'Kesamudram', 'Nellikudur', 'Gudur', 'Gangaram', 'Bayyaram'] },
  { id: 1054, name: 'డోర్నకల్-Dornakal', dstrct_id: 43, mandals: ['Dornakal', 'Maripeda', 'Narsimhulapet', 'Danthalapally', 'Chinnagudur', 'Garla'] },

  // Khammam (41)
  { id: 1055, name: 'ఖమ్మం-Khammam', dstrct_id: 41, mandals: ['Khammam Urban', 'Khammam Rural'] },
  { id: 1056, name: 'పాలేరు-Palair', dstrct_id: 41, mandals: ['Kusumanchi', 'Nelakondapally', 'Thirumalayapalem', 'Khammam Rural'] },
  { id: 1057, name: 'మధిర-Madhira', dstrct_id: 41, mandals: ['Madhira', 'Bonakal', 'Chinthakani', 'Mudigonda', 'Errupalem'] },
  { id: 1058, name: 'వైరా-Wyra', dstrct_id: 41, mandals: ['Wyra', 'Enkoor', 'Konijerla', 'Singareni', 'Julurpad'] },
  { id: 1059, name: 'సత్తుపల్లి-Sathupalle', dstrct_id: 41, mandals: ['Sathupalli', 'Penuballi', 'Kallur', 'Thallada', 'Vemsoor'] },

  // Bhadradri Kothagudem (32)
  { id: 1060, name: 'పినపాక-Pinapaka', dstrct_id: 32, mandals: ['Pinapaka', 'Manuguru', 'Cherla', 'Dummugudem', 'Karakagudem', 'Gundala', 'Aswapuram'] },
  { id: 1061, name: 'ఇల్లందు-Yellandu', dstrct_id: 32, mandals: ['Yellandu', 'Kamepalli', 'Bayyaram', 'Tekulapally', 'Allapally'] },
  { id: 1062, name: 'కొత్తగూడెం-Kothagudem', dstrct_id: 32, mandals: ['Kothagudem', 'Palwancha', 'Sujatanagar', 'Chunchupally', 'Laxmidevipally'] },
  { id: 1063, name: 'అశ్వారావుపేట-Aswaraopeta', dstrct_id: 32, mandals: ['Aswaraopeta', 'Dammapeta', 'Chandrugonda', 'Mulakalapally', 'Annapureddypally'] },
  { id: 1064, name: 'భద్రాచలం-Bhadrachalam', dstrct_id: 32, mandals: ['Bhadrachalam', 'Dummugudem', 'Cherla', 'Venkatapuram', 'Wazeed'] },

  // Mahabubnagar (44)
  { id: 1065, name: 'మహబూబ్ నగర్-Mahabubnagar', dstrct_id: 44, mandals: ['Mahabubnagar Urban', 'Mahabubnagar Rural', 'Hanwada', 'Nawabpet'] },
  { id: 1066, name: 'జడ్చర్ల-Jadcherla', dstrct_id: 44, mandals: ['Jadcherla', 'Nawabpet', 'Balanagar', 'Rajapur', 'Midjil', 'Bhoothpur'] },
  { id: 1067, name: 'దేవరకద్ర-Devarkadra', dstrct_id: 44, mandals: ['Devarkadra', 'Kothakota', 'Madanapur', 'Chinnachintakunta', 'Addakal', 'Moosapet', 'Bhoothpur'] },

  // Nagarkurnool (49)
  { id: 1068, name: 'నాగర్ కర్నూల్-Nagarkurnool', dstrct_id: 49, mandals: ['Nagarkurnool', 'Bijinapally', 'Thimmajipet', 'Tadoor', 'Telkapally'] },
  { id: 1069, name: 'అచ్చంపేట-Achampet', dstrct_id: 49, mandals: ['Achampet', 'Amrabad', 'Balmoor', 'Lingal', 'Padara', 'Uppununthala', 'Vangoor'] },
  { id: 1070, name: 'కల్వకుర్తి-Kalwakurthy', dstrct_id: 49, mandals: ['Kalwakurthy', 'Veldanda', 'Talakondapally', 'Amangal', 'Madgul', 'Urkonda'] },
  { id: 1071, name: 'కొల్లాపూర్-Kollapur', dstrct_id: 49, mandals: ['Kollapur', 'Peddakothapally', 'Kodair', 'Pangal', 'Pentlavelli'] },

  // Wanaparthy (61)
  { id: 1072, name: 'వనపర్తి-Wanaparthy', dstrct_id: 61, mandals: ['Wanaparthy', 'Gopalpete', 'Ravulapalem', 'Pebbair', 'Srirangapur', 'Veepanagandla', 'Peddamandadi', 'Ghanpur', 'Revally'] },

  // Jogulamba Gadwal (38)
  { id: 1073, name: 'గద్వాల-Gadwal', dstrct_id: 38, mandals: ['Gadwal', 'Dharoor', 'Maldakal', 'Ghattu', 'Kaloor Timmanadoddi'] },
  { id: 1074, name: 'అలంపూర్-Alampur', dstrct_id: 38, mandals: ['Alampur', 'Ieeja', 'Itikyal', 'Manopad', 'Waddepally', 'Rajoli', 'Undavelli'] },

  // Narayanpet (51)
  { id: 1075, name: 'మక్తల్-Makthal', dstrct_id: 51, mandals: ['Makthal', 'Maganoor', 'Krishna', 'Utkoor', 'Narva'] },
  { id: 1076, name: 'నారాయణపేట-Narayanpet', dstrct_id: 51, mandals: ['Narayanpet', 'Damargidda', 'Dhanwada', 'Marikal', 'Kosgi', 'Maddur'] },

  // Nalgonda (50)
  { id: 1077, name: 'నల్గొండ-Nalgonda', dstrct_id: 50, mandals: ['Nalgonda', 'Thipparthy', 'Kangal', 'Madugulapally'] },
  { id: 1078, name: 'నకిరేకల్-Nakrekal', dstrct_id: 50, mandals: ['Nakrekal', 'Kethepally', 'Kattangur', 'Chityal', 'Narketpally', 'Ramannapet'] },
  { id: 1079, name: 'మిర్యాలగూడ-Miryalaguda', dstrct_id: 50, mandals: ['Miryalaguda', 'Dameracherla', 'Vemulapally', 'Adavidevulapally'] },
  { id: 1080, name: 'దేవరకొండ-Devarakonda', dstrct_id: 50, mandals: ['Devarakonda', 'Chinthapally', 'Gundlapally', 'Chandampet', 'Neredugommu', 'Pedda Adiserlapally'] },
  { id: 1081, name: 'నాగార్జున సాగర్-Nagarjuna Sagar', dstrct_id: 50, mandals: ['Nidamanoor', 'Gurrampode', 'Peddavoora', 'Anumula', 'Tripuraram', 'Tirumalagiri Sagar'] },

  // Suryapet (59)
  { id: 1082, name: 'సూర్యాపేట-Suryapet', dstrct_id: 59, mandals: ['Suryapet', 'Chivvemla', 'Penpahad', 'Atmakur (S)'] },
  { id: 1083, name: 'తుంగతుర్తి-Thungathurthi', dstrct_id: 59, mandals: ['Thungathurthi', 'Thirumalagiri', 'Nagaram', 'Jaji Reddi Gudem', 'Saligouraram', 'Mothkur', 'Maddirala'] },
  { id: 1084, name: 'కోదాడ-Kodad', dstrct_id: 59, mandals: ['Kodad', 'Munagala', 'Nadigudem', 'Chilkur', 'Ananthagiri'] },
  { id: 1085, name: 'హుజూర్ నగర్-Huzurnagar', dstrct_id: 59, mandals: ['Huzurnagar', 'Mattampally', 'Mellachervu', 'Garidepally', 'Neradcherla', 'Palakeedu'] },

  // Yadadri Bhuvanagiri (63)
  { id: 1086, name: 'భువనగిరి-Bhongir', dstrct_id: 63, mandals: ['Bhongir', 'Bibinagar', 'Bhoodan Pochampally', 'Valigonda', 'Yadagirigutta'] },
  { id: 1087, name: 'ఆలేరు-Alair', dstrct_id: 63, mandals: ['Alair', 'Rajapet', 'Yadagirigutta', 'Turkapally', 'Gundala', 'Atmakur (M)', 'Motakondur'] },
  { id: 1088, name: 'మునుగోడు-Munugode', dstrct_id: 63, mandals: ['Munugode', 'Chandur', 'Marriguda', 'Nampally', 'Sansthan Narayanpur', 'Choutuppal'] },

  // Vikarabad (60)
  { id: 1089, name: 'పరిగి-Parigi', dstrct_id: 60, mandals: ['Parigi', 'Doma', 'Kulkacherla', 'Gandeed', 'Pudur', 'Choudapur'] },
  { id: 1090, name: 'వికారాబాద్-Vikarabad', dstrct_id: 60, mandals: ['Vikarabad', 'Dharur', 'Marpalle', 'Mominpet', 'Kotepally'] },
  { id: 1091, name: 'తాండూరు-Tandur', dstrct_id: 60, mandals: ['Tandur', 'Peddemul', 'Basheerabad', 'Yalal'] },
  { id: 1092, name: 'కొడంగల్-Kodangal', dstrct_id: 60, mandals: ['Kodangal', 'Bomraspet', 'Doulthabad'] },

  // Medchal-Malkajgiri (47)
  { id: 1093, name: 'మేడ్చల్-Medchal', dstrct_id: 47, mandals: ['Medchal', 'Shamirpet', 'Ghatkesar', 'Keesara', 'Muduchintalpally', 'Medipally', 'Kapra'] },
  { id: 1094, name: 'మల్కాజ్ గిరి-Malkajgiri', dstrct_id: 47, mandals: ['Malkajgiri', 'Alwal'] },
  { id: 1095, name: 'కుత్బుల్లాపూర్-Quthbullapur', dstrct_id: 47, mandals: ['Quthbullapur', 'Nizampet', 'Dundigal Gandimaisamma', 'Bachupally'] },
  { id: 1096, name: 'కూకట్ పల్లి-Kukatpally', dstrct_id: 47, mandals: ['Kukatpally', 'Balanagar', 'Moosapet'] },
  { id: 1097, name: 'ఉప్పల్-Uppal', dstrct_id: 47, mandals: ['Uppal', 'Kapra', 'Ghatkesar'] },

  // Ranga Reddy (56)
  { id: 1098, name: 'ఇబ్రహీంపట్నం-Ibrahimpatnam', dstrct_id: 56, mandals: ['Ibrahimpatnam', 'Manchal', 'Yacharam', 'Madgul', 'Abdullapurmet'] },
  { id: 1099, name: 'ఎల్.బి. నగర్-Lal Bahadur Nagar', dstrct_id: 56, mandals: ['Saroornagar', 'Hayathnagar'] },
  { id: 1100, name: 'మహేశ్వరం-Maheshwaram', dstrct_id: 56, mandals: ['Maheshwaram', 'Kandukur', 'Shamshabad', 'Jalpally'] },
  { id: 1101, name: 'రాజేంద్రనగర్-Rajendranagar', dstrct_id: 56, mandals: ['Rajendranagar', 'Gandipet', 'Shamshabad'] },
  { id: 1102, name: 'శేరిలింగంపల్లి-Serilingampally', dstrct_id: 56, mandals: ['Serilingampally', 'Chandanagar', 'Miyapur', 'Gachibowli'] },
  { id: 1103, name: 'చేవెళ్ల-Chevella', dstrct_id: 56, mandals: ['Chevella', 'Shabad', 'Shahbad', 'Moinabad', 'Shankarpally'] },
  { id: 1104, name: 'షాద్ నగర్-Shadnagar', dstrct_id: 56, mandals: ['Farooqnagar', 'Kothur', 'Kondurg', 'Keshampet', 'Nandigama', 'Chowderguda'] },

  // Hyderabad (34)
  { id: 1105, name: 'ముషీరాబాద్-Musheerabad', dstrct_id: 34, mandals: ['Musheerabad'] },
  { id: 1106, name: 'మలక్ పేట-Malakpet', dstrct_id: 34, mandals: ['Malakpet', 'Saidabad'] },
  { id: 1107, name: 'అంబర్ పేట-Amberpet', dstrct_id: 34, mandals: ['Amberpet'] },
  { id: 1108, name: 'ఖైరతాబాద్-Khairatabad', dstrct_id: 34, mandals: ['Khairatabad', 'Ameerpet'] },
  { id: 1109, name: 'జూబ్లీహిల్స్-Jubilee Hills', dstrct_id: 34, mandals: ['Shaikpet', 'Jubilee Hills'] },
  { id: 1110, name: 'సనత్ నగర్-Sanathnagar', dstrct_id: 34, mandals: ['Ameerpet', 'Sanathnagar'] },
  { id: 1111, name: 'నాంపల్లి-Nampally', dstrct_id: 34, mandals: ['Nampally', 'Asifnagar'] },
  { id: 1112, name: 'కార్వాన్-Karwan', dstrct_id: 34, mandals: ['Asifnagar', 'Golconda'] },
  { id: 1113, name: 'గోషామహల్-Goshamahal', dstrct_id: 34, mandals: ['Goshamahal', 'Nampally'] },
  { id: 1114, name: 'చార్మినార్-Charminar', dstrct_id: 34, mandals: ['Charminar'] },
  { id: 1115, name: 'చాంద్రాయణగుట్ట-Chandrayangutta', dstrct_id: 34, mandals: ['Chandrayangutta', 'Bandlaguda'] },
  { id: 1116, name: 'యాకుత్ పురా-Yakutpura', dstrct_id: 34, mandals: ['Yakutpura', 'Saidabad'] },
  { id: 1117, name: 'బహదూర్ పురా-Bahadurpura', dstrct_id: 34, mandals: ['Bahadurpura'] },
  { id: 1118, name: 'సికింద్రాబాద్-Secunderabad', dstrct_id: 34, mandals: ['Secunderabad'] },
  { id: 1119, name: 'సికింద్రాబాద్ కంటోన్మెంట్-Secunderabad Cantt', dstrct_id: 34, mandals: ['Marredpally', 'Cantonment'] }
];

async function runMigration() {
  console.log('Connecting to AWS RDS MySQL...');
  const conn = await mysql.createConnection({
    host: 'jbac-mysql-db-v3.cdeeuw0s2trf.ap-southeast-2.rds.amazonaws.com',
    user: 'admin',
    password: process.env.RDS_PASSWORD || 'biUt2TrZ9EZAqn6GXhiA',
    database: 'jbac_jbac'
  });

  console.log('Connected! Starting Phase 1 schema alterations & data seeding...');

  // Helper to add column if not exists
  async function addCol(table, col, def) {
    try {
      const [cols] = await conn.query(`SHOW COLUMNS FROM \`${table}\` LIKE '${col}'`);
      if (cols.length === 0) {
        console.log(`Adding ${col} to ${table}...`);
        await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${col}\` ${def}`);
      }
    } catch (e) {
      console.warn(`Could not add ${col} to ${table}:`, e.message);
    }
  }

  // 1. Alter geo base tables
  await addCol('dstrct', 'state_id', 'INT DEFAULT 1');
  await conn.query('UPDATE dstrct SET state_id = 1 WHERE state_id IS NULL OR state_id = 0');

  await addCol('const_dtl_t', 'state_id', 'INT DEFAULT 1');
  await conn.query('UPDATE const_dtl_t SET state_id = 1 WHERE state_id IS NULL OR state_id = 0');

  await addCol('mndls_lst_t', 'state_id', 'INT DEFAULT 1');
  await conn.query('UPDATE mndls_lst_t SET state_id = 1 WHERE state_id IS NULL OR state_id = 0');

  await addCol('pnchyt_lst_t', 'state_id', 'INT DEFAULT 1');
  await conn.query('UPDATE pnchyt_lst_t SET state_id = 1 WHERE state_id IS NULL OR state_id = 0');

  // 2. Alter user registration and categorical tables
  const userTables = [
    'signup_form', 'student_reg', 'pastor_reg', 'pastors_tbl', 'church_reg',
    'ministry_signup', 'ministry_tbl', 'independentorganisation_reg', 'organisation_tbl',
    'pastors_associations', 'pastorsassociations_tbl', 'tbl_councelling_doctor',
    'events', 'users'
  ];

  for (const t of userTables) {
    await addCol(t, 'state_id', 'INT DEFAULT 1');
    await addCol(t, 'state', "VARCHAR(100) DEFAULT 'Andhra Pradesh'");
    try {
      await conn.query(`UPDATE \`${t}\` SET state_id = 1 WHERE state_id IS NULL OR state_id = 0`);
      await conn.query(`UPDATE \`${t}\` SET state = 'Andhra Pradesh' WHERE state IS NULL OR state = ''`);
    } catch (e) {}
  }

  // 3. Update or recreate views so state_id is exposed
  console.log('Recreating views with state_id...');
  await conn.query('CREATE OR REPLACE VIEW `districts` AS SELECT `dstrct`.`id` AS `id`, `dstrct`.`distrct_nm` AS `name`, `dstrct`.`distrct_nm` AS `distrct_nm`, `dstrct`.`state_id` AS `state_id`, `dstrct`.`d_in` AS `d_in` FROM `dstrct`');
  await conn.query('CREATE OR REPLACE VIEW `constituencies` AS SELECT `const_dtl_t`.`id` AS `id`, `const_dtl_t`.`const_nm` AS `name`, `const_dtl_t`.`const_nm` AS `const_nm`, `const_dtl_t`.`dstrct_id` AS `dstrct_id`, `const_dtl_t`.`state_id` AS `state_id`, `const_dtl_t`.`d_in` AS `d_in` FROM `const_dtl_t`');
  await conn.query('CREATE OR REPLACE VIEW `mandals` AS SELECT `mndls_lst_t`.`id` AS `id`, `mndls_lst_t`.`mndl_nm` AS `name`, `mndls_lst_t`.`mndl_nm` AS `mndl_nm`, `mndls_lst_t`.`const_id` AS `const_id`, `mndls_lst_t`.`dstrct_id` AS `dstrct_id`, `mndls_lst_t`.`state_id` AS `state_id`, `mndls_lst_t`.`d_in` AS `d_in` FROM `mndls_lst_t`');
  await conn.query('CREATE OR REPLACE VIEW `panchayats` AS SELECT `pnchyt_lst_t`.`id` AS `id`, `pnchyt_lst_t`.`pnchyt_nm` AS `name`, `pnchyt_lst_t`.`pnchyt_nm` AS `pnchyt_nm`, `pnchyt_lst_t`.`mndl_id` AS `mndl_id`, `pnchyt_lst_t`.`state_id` AS `state_id`, `pnchyt_lst_t`.`d_in` AS `d_in` FROM `pnchyt_lst_t`');

  // 4. Create or update clean 'states' table
  await conn.query(`
    CREATE TABLE IF NOT EXISTS \`states\` (
      \`id\` INT PRIMARY KEY,
      \`state_name\` VARCHAR(255) NOT NULL,
      \`code\` VARCHAR(10) NOT NULL,
      \`d_in\` INT DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);

  await conn.query(`
    INSERT INTO \`states\` (\`id\`, \`state_name\`, \`code\`, \`d_in\`)
    VALUES 
      (1, 'Andhra Pradesh-ఆంధ్రప్రదేశ్', 'AP', 0),
      (2, 'Telangana-తెలంగాణ', 'TG', 0)
    ON DUPLICATE KEY UPDATE state_name = VALUES(state_name), code = VALUES(code)
  `);
  console.log('States table verified with AP (1) and TG (2).');

  // 5. Seed 33 Telangana Districts
  console.log('Seeding 33 Telangana districts into dstrct...');
  for (const d of tgDistricts) {
    await conn.query(`
      INSERT INTO \`dstrct\` (\`id\`, \`distrct_nm\`, \`state_id\`, \`d_in\`)
      VALUES (?, ?, ?, 0)
      ON DUPLICATE KEY UPDATE distrct_nm = VALUES(distrct_nm), state_id = VALUES(state_id)
    `, [d.id, d.name, d.state_id]);
  }
  console.log('33 Telangana districts seeded.');

  // Helper for batch insert
  async function batchInsert(table, columns, rows, chunkSize = 100) {
    if (rows.length === 0) return;
    const colList = columns.map(c => `\`${c}\``).join(', ');
    const updateClause = columns.filter(c => c !== 'id').map(c => `\`${c}\` = VALUES(\`${c}\`)`).join(', ');
    
    for (let i = 0; i < rows.length; i += chunkSize) {
      const chunk = rows.slice(i, i + chunkSize);
      const placeholders = chunk.map(() => `(${columns.map(() => '?').join(', ')})`).join(', ');
      const flatValues = chunk.flat();
      await conn.query(`
        INSERT INTO \`${table}\` (${colList})
        VALUES ${placeholders}
        ON DUPLICATE KEY UPDATE ${updateClause}
      `, flatValues);
    }
  }

  // 6. Prepare and Batch Seed 119 Telangana Constituencies, Mandals & Panchayats/Wards
  console.log('Preparing Telangana constituencies, mandals, and panchayats/wards data...');
  const constRows = [];
  const mandalRows = [];
  const panchayatRows = [];

  let mandalCounter = 2001;
  let panchayatCounter = 20001;

  for (const c of tgConstituencies) {
    constRows.push([c.id, c.name, c.dstrct_id, 2, 0]);

    for (const mName of c.mandals) {
      const currentMandalId = mandalCounter++;
      const fullMandalName = `${mName} మండలం-${mName}`;
      mandalRows.push([currentMandalId, fullMandalName, c.id, c.dstrct_id, 2, 0]);

      const wards = [
        `${mName} హెడ్ క్వార్టర్ పంచాయతీ-${mName} H.Q`,
        `${mName} వార్డు నెం. 1-Ward No. 1`,
        `${mName} వార్డు నెం. 2-Ward No. 2`,
        `${mName} వార్డు నెం. 3-Ward No. 3`,
        `${mName} వార్డు నెం. 4-Ward No. 4`,
        `${mName} వార్డు నెం. 5-Ward No. 5`,
        `${mName} వార్డు నెం. 6-Ward No. 6`,
        `${mName} వార్డు నెం. 7-Ward No. 7`,
        `${mName} వార్డు నెం. 8-Ward No. 8`,
        `${mName} వార్డు నెం. 9-Ward No. 9`,
        `${mName} వార్డు నెం. 10-Ward No. 10`
      ];

      for (const w of wards) {
        const currentPanchayatId = panchayatCounter++;
        panchayatRows.push([currentPanchayatId, w, currentMandalId, 2, 0]);
      }
    }
  }

  console.log(`Prepared ${constRows.length} constituencies, ${mandalRows.length} mandals, ${panchayatRows.length} panchayats/wards.`);
  console.log('Batch inserting constituencies...');
  await batchInsert('const_dtl_t', ['id', 'const_nm', 'dstrct_id', 'state_id', 'd_in'], constRows, 100);

  console.log('Batch inserting mandals...');
  await batchInsert('mndls_lst_t', ['id', 'mndl_nm', 'const_id', 'dstrct_id', 'state_id', 'd_in'], mandalRows, 100);

  console.log('Batch inserting panchayats/wards...');
  await batchInsert('pnchyt_lst_t', ['id', 'pnchyt_nm', 'mndl_id', 'state_id', 'd_in'], panchayatRows, 200);

  console.log('Batch seeding completed successfully!');

  // Final count checks
  const [[{ dCount }]] = await conn.query('SELECT COUNT(*) as dCount FROM dstrct');
  const [[{ cCount }]] = await conn.query('SELECT COUNT(*) as cCount FROM const_dtl_t');
  const [[{ mCount }]] = await conn.query('SELECT COUNT(*) as mCount FROM mndls_lst_t');
  const [[{ pCount }]] = await conn.query('SELECT COUNT(*) as pCount FROM pnchyt_lst_t');
  console.log(`\nFinal Totals:
  Districts: ${dCount} (26 AP + 33 TG = 59)
  Constituencies: ${cCount} (175 AP + 119 TG = 294)
  Mandals: ${mCount}
  Panchayats & Wards: ${pCount}`);

  await conn.end();
  console.log('Phase 1 Database migration complete!');
}

runMigration().catch(console.error);
