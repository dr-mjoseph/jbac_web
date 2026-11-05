import sys

# 1. Patch dropdown_fallback_data.ts
with open('src/app/jesus/dropdown_fallback_data.ts', 'r', encoding='utf-8') as f:
    fb_text = f.read()

if '"business_types"' not in fb_text:
    anchor_fb = '  ]\n};'
    types_json = ''',
  "business_types": [
    { "id": 1, "business_type": "వ్యవసాయం & అనుబంధ రంగాలు - Agriculture & Allied", "type_telugu": "వ్యవసాయం & అనుబంధ రంగాలు", "type_english": "Agriculture & Allied" },
    { "id": 2, "business_type": "తయారీ రంగం - Manufacturing Industries", "type_telugu": "తయారీ రంగం", "type_english": "Manufacturing Industries" },
    { "id": 3, "business_type": "రిటైల్ & హోల్‌సేల్ వ్యాపారం - Retail & Wholesale Trading", "type_telugu": "రిటైల్ & హోల్‌సేల్ వ్యాపారం", "type_english": "Retail & Wholesale Trading" },
    { "id": 4, "business_type": "ఆహార ఉత్పత్తులు & హోటల్స్ - Food Processing & Hospitality / Restaurants", "type_telugu": "ఆహార ఉత్పత్తులు & హోటల్స్", "type_english": "Food Processing & Hospitality / Restaurants" },
    { "id": 5, "business_type": "ఇన్ఫర్మేషన్ టెక్నాలజీ (IT) & సాఫ్ట్‌వేర్ - Information Technology (IT) & Software", "type_telugu": "ఇన్ఫర్మేషన్ టెక్నాలజీ (IT) & సాఫ్ట్‌వేర్", "type_english": "Information Technology (IT) & Software" },
    { "id": 6, "business_type": "విద్య & నైపుణ్య శిక్షణ - Education & Skill Training", "type_telugu": "విద్య & నైపుణ్య శిక్షణ", "type_english": "Education & Skill Training" },
    { "id": 7, "business_type": "వైద్యం & ఆరోగ్య సేవలు - Healthcare & Medical Services", "type_telugu": "వైద్యం & ఆరోగ్య సేవలు", "type_english": "Healthcare & Medical Services" },
    { "id": 8, "business_type": "రవాణా & లాజిస్టిక్స్ - Transport & Logistics", "type_telugu": "రవాణా & లాజిస్టిక్స్", "type_english": "Transport & Logistics" },
    { "id": 9, "business_type": "భవన నిర్మాణం & రియల్ ఎస్టేట్ - Construction & Real Estate", "type_telugu": "భవన నిర్మాణం & రియల్ ఎస్టేట్", "type_english": "Construction & Real Estate" },
    { "id": 10, "business_type": "వస్త్ర & దుస్తుల పరిశ్రమ - Textiles & Garments", "type_telugu": "వస్త్ర & దుస్తుల పరిశ్రమ", "type_english": "Textiles & Garments" },
    { "id": 11, "business_type": "సర్వీస్ & రిపేర్ రంగాలు - Services, Electrical & Maintenance", "type_telugu": "సర్వీస్ & రిపేర్ రంగాలు", "type_english": "Services, Electrical & Maintenance" },
    { "id": 12, "business_type": "పునరుత్పాదక ఇంధనం & సోలార్ - Renewable Energy & Solar", "type_telugu": "పునరుత్పాదక ఇంధనం & సోలార్", "type_english": "Renewable Energy & Solar" },
    { "id": 13, "business_type": "పౌల్ట్రీ & డైరీ ఫామింగ్ - Poultry & Dairy Farming", "type_telugu": "పౌల్ట్రీ & డైరీ ఫామింగ్", "type_english": "Poultry & Dairy Farming" },
    { "id": 14, "business_type": "ఈ-కామర్స్ & డిజిల్ మార్కెటింగ్ - E-Commerce & Digital Marketing", "type_telugu": "ఈ-కామర్స్ & డిజిటల్ మార్కెటింగ్", "type_english": "E-Commerce & Digital Marketing" },
    { "id": 15, "business_type": "ముద్రణ & ప్యాకేజింగ్ - Printing & Packaging", "type_telugu": "ముద్రణ & ప్యాకేజింగ్", "type_english": "Printing & Packaging" },
    { "id": 16, "business_type": "ఇతర నూతన వ్యాపారాలు - Other Innovative Startups & Businesses", "type_telugu": "ఇతర నూతన వ్యాపారాలు", "type_english": "Other Innovative Startups & Businesses" }
  ]
};'''
    if anchor_fb in fb_text:
        fb_text = fb_text.replace(anchor_fb, '  ]' + types_json)
        with open('src/app/jesus/dropdown_fallback_data.ts', 'w', encoding='utf-8') as f:
            f.write(fb_text)
        print("Updated dropdown_fallback_data.ts with business_types!")
    else:
        print("Could not find anchor in dropdown_fallback_data.ts")

# 2. Patch service.service.ts
with open('src/app/jesus/service.service.ts', 'r', encoding='utf-8') as f:
    svc_text = f.read()

if 'getBusinessTypes' not in svc_text:
    idx = svc_text.rfind('}')
    methods = """
  // Entrepreneur & Investor API methods
  getBusinessTypes(): Observable<any> {
    return this.http.post<any>(this.testApi + 'business-types', {}).pipe(
      map(res => {
        if (!res || !res.data || res.data.length === 0) {
          return { status: 200, data: (FALLBACK_DROPDOWN_DATA as any).business_types || [], message: 'Success' };
        }
        return res;
      }),
      catchError(() => of({ status: 200, data: (FALLBACK_DROPDOWN_DATA as any).business_types || [], message: 'Success' }))
    );
  }

  registerEntrepreneur(data: any): Observable<any> {
    return this.http.post<any>(this.testApi + 'entrepreneur-register', data).pipe(map(res => res, (err: any) => err));
  }

  registerInvestor(data: any): Observable<any> {
    return this.http.post<any>(this.testApi + 'investor-register', data).pipe(map(res => res, (err: any) => err));
  }

  getAdminEntrepreneurs(): Observable<any> {
    return this.http.get<any>(this.testApi + 'admin-entrepreneurs').pipe(map(res => res, (err: any) => err));
  }

  getAdminInvestors(): Observable<any> {
    return this.http.get<any>(this.testApi + 'admin-investors').pipe(map(res => res, (err: any) => err));
  }

  updateAdminEntrepreneur(data: any): Observable<any> {
    return this.http.post<any>(this.testApi + 'admin-update-entrepreneur', data).pipe(map(res => res, (err: any) => err));
  }

  updateAdminInvestor(data: any): Observable<any> {
    return this.http.post<any>(this.testApi + 'admin-update-investor', data).pipe(map(res => res, (err: any) => err));
  }
}
"""
    svc_text = svc_text[:idx] + methods + svc_text[idx+1:]
    with open('src/app/jesus/service.service.ts', 'w', encoding='utf-8') as f:
        f.write(svc_text)
    print("Updated service.service.ts with Entrepreneur & Investor methods!")
