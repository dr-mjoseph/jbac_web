// var cmdSch =  require('../../../validators/commonVld');

// isDate,isEmail,isInt,isUpperCase,

// isLength: {
//     errorMessage: 'Password should be at least 7 chars long',
//     options: { min: 7 }
//   }


// validations for adding a assert into db

// Dashboard  validations
exports.loginvalidations = {
    "body": {
       'number': {
           notEmpty: true,
           matches: {
               options : [/^[0-9]{10}$/],//one spec chara,one number,must have 6 to 16 characters
               errorMessage: 'Please enter valid Mobile number' // Error message for the parameter
           },
           errorMessage: 'Password is Required'
       }
    }
};
exports.userSignupValidations = {
    
    "body": {
       'user_name': {
           notEmpty: true,
           errorMessage: 'Name is Required'
       },
       'usr_phone': {
           notEmpty: true,
           matches: {
               options : [/^[0-9]{10}$/],
               errorMessage: 'Please enter valid Mobile number' // Error message for the parameter
           },
           errorMessage: 'Password is Required'
       },
       'usr_email': {
           notEmpty: true,
           matches: {
               options : [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/],
               errorMessage: 'Please enter valid Email' // Error message for the parameter
           },
           errorMessage: 'Password is Required'
       },
       'gender': {
           notEmpty: true,
           errorMessage: 'Gender is Required'
       }
    }
};
exports.profileupdatevalidations = {
    
    "body": {
       'user_name': {
           notEmpty: true,
           errorMessage: 'Name is Required'
       },
       'usr_email': {
           notEmpty: true,
           matches: {
               options : [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/],
               errorMessage: 'Please enter valid Email' // Error message for the parameter
           },
           errorMessage: 'Password is Required'
       },
       'gender': {
           notEmpty: true,
           errorMessage: 'Gender is Required'
       }
    }
};

// Dashboard  validations end


exports.mstrVldt = {
    "body": {
        
      'usr_nm': {
           notEmpty: true,
           errorMessage: 'User Name is Required'
       },
       'pwd': {
           notEmpty: true,
           matches: {
               options : [/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/],//one spec chara,one number,must have 6 to 16 characters
               errorMessage: 'Invalid Password, Password must have atleast one character , ane number and minimum 6 characters' // Error message for the parameter
           },
           errorMessage: 'Password is Required'
       }
    }
};

exports.ctgryPost = {
    "body": {
        
      'ctgry_nm': {
           notEmpty: true,
           matches:{
            options:[/^[a-zA-Z0-9-,]+(\s{0,1}[a-zA-Z0-9-, ])*$/],
            errorMessage:'Invalid Category name '
        },
        
           errorMessage: 'category Name is Required'
       },
       'img1': {
            notEmpty: true,
            errorMessage: 'Web Image is Required'
        },
        'img2': {
            notEmpty: true,
            errorMessage: 'Mobile Image is Required'
        }

    }
};

exports.subCtgryPost = {
    "body": {
        
      'ctgry_id': {
           notEmpty: true,
           isInt : {
            errorMessage: 'Invalid Category Id' // Error message for the parameter
           },
           errorMessage: 'Category Id is Required'
       },
       'sub_ctgry_nm': {
            notEmpty: true,
            matches:{
                options:[/^[a-zA-Z0-9-,]+(\s{0,1}[a-zA-Z0-9-, ])*$/],
            },
            
            errorMessage: 'Sub Category Name is Required'
        },
        'img1': {
            notEmpty: true,
            errorMessage: 'Web Image is Required'
        },
        'img2': {
            notEmpty: true,
            errorMessage: 'Mobile Image is Required'
        }
    }
};

exports.getSubCtgry = {

    "params": {
      'ctgry_id': {
           notEmpty: true,
           isInt : {
            errorMessage: 'Invalid Category Id' // Error message for the parameter
           },
           errorMessage: 'Category Id is Required'
       }
    }
};

exports.postEx_Ctgry = {

    "params": {

      'ctgry_id': {
           notEmpty: true,
           isInt : {
            errorMessage: 'Invalid Category Id' // Error message for the parameter
           },
           errorMessage: 'Category Id is Required'
       },
       'sub_ctgry_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Sub Category Id' // Error message for the parameter
            },
            errorMessage: 'Sub Category Id is Required'
        },
       'ex_ctgry_nm': {
            notEmpty: true,
            matches:{
                options:[/^[a-zA-Z0-9-,]+(\s{0,1}[a-zA-Z0-9-, ])*$/],
            },
           
            errorMessage: 'Exam Category Name is Required'
        },
        'img1': {
            notEmpty: true,
            errorMessage: 'Web Image is Required'
        },
        'img2': {
            notEmpty: true,
            errorMessage: 'Mobile Image is Required'
        }
    }
};

exports.postSections = {

    "body": {
        
        'secn_nm': {
            notEmpty: true,
            matches:{
                options:[/^[a-zA-Z0-9-,]+(\s{0,1}[a-zA-Z0-9-, ])*$/],
            },
            
            errorMessage: 'Section  Name is Required'
        }
    }
};

exports.postNtfcn = {

    "body": {
        
        'ntfcn_typ': {
            notEmpty: true,
            
            matches:{
                options:[/^[a-zA-Z0-9-,]+(\s{0,1}[a-zA-Z0-9-, ])*$/],
            errorMessage: 'Invalid Notification Type'
            },
            errorMessage: 'Notification Type is Required'
        },
        'ntfcn_exm_tlt' : {
            notEmpty: true,
            matches:{
                options:[/^[a-zA-Z0-9-,]+(\s{0,1}[a-zA-Z0-9-, ])*$/],
                errorMessage: 'Invalid Notification Title'
            },
            
            errorMessage: 'Notification Title is Required'
        },
        'ntfcn_imp_dtls' : {
            notEmpty: true,
            
            matches:{
                options:[/^[a-zA-Z0-9-,]+(\s{0,1}[a-zA-Z0-9-, ])*$/],
                errorMessage: 'Invalid Notification Details'
            },
            
            errorMessage: 'Notification Details is Required'
        },
        'ntfcn_dcrptn' : {
            notEmpty: true,
            matches:{
                options:[/^[a-zA-Z0-9-,]+(\s{0,1}[a-zA-Z0-9-, ])*$/],
                errorMessage: 'Invalid Notification Description'
            },
            
            errorMessage: 'Notification Description is Required'
        },
        'ntfcn_url_lnk' : {
            notEmpty: true,
            
            matches:{
                options:[/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/],
                errorMessage: 'Invalid Notification Description'
            },
            
            errorMessage: 'Notification Url is Required'
        },
        'img' : {
            notEmpty: true,
            matches:{
                options:[/^[-A-Za-z0-9+=]{1,50}|=[^=]|={3,}$/],
                errorMessage: 'Invalid Image'
            },
            
            errorMessage: 'Image is Required'
        }
    }
};

// exports.checkInstr = {
//     "body":{
//         'test_id': {
//             notEmpty: true,
//             isInt:{
//                 errorMessage: 'Invalid Test Id' // Error message for the parameter
//             },
//             errorMessage: 'Test Id Required'
//         },
//         'subject': {
//             notEmpty: true,
//             isAlpha:{
//                 errorMessage: 'Invalid Section Id' // Error message for the parameter
//             },
//             errorMessage: 'Section Id Required'
//         },
//     },
// };

exports.checkInstr = {

    "body":{
        'Question': {
            notEmpty: true,
            errorMessage: 'Question Required'
        },
        'QuestType': {
            notEmpty: true,
            isInt:{
                errorMessage: 'Invalid Question Type' // Error message for the parameter
            },
            errorMessage: 'Question Type Required'
        },
        'Level': {
            notEmpty: true,
            isAlpha: {
                errorMessage: 'Invalid Level' // Error message for the parameter
            },
            errorMessage: 'Level Required'
        },
        'Option1': {
            notEmpty: true,
            isAlpha:{
                errorMessage: 'Invalid Option 1' // Error message for the parameter
            },
            errorMessage: 'Option 1 Required'
        },
        'Option2': {
            notEmpty: true,
            isAlpha: {
                errorMessage: 'Invalid Option 2' // Error message for the parameter
            },
            errorMessage: 'Option 2 Required'
        },
        'Option3': {
            notEmpty: true,
            isAlpha: {
                errorMessage: 'Invalid Option 3' // Error message for the parameter
            },
            errorMessage: 'Option 3 Required'
        },
        'Option4': {
            notEmpty: true,
            isAlpha: {
                errorMessage: 'Invalid Option 4' // Error message for the parameter
            },
            errorMessage: 'Option 4 Required'
        },
        'CorrectOption': {
            notEmpty: true,
            isInt: {
                errorMessage: 'Invalid Correct Option' // Error message for the parameter
            },
            errorMessage: 'Correct Option Required'
        }
    }
};

exports.postConcpt = {

    "body":{

        'secn_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Section Id' // Error message for the parameter
            },
            errorMessage: 'Section Id Required'
        },
        'concpt_nm': {
            notEmpty: true,
            matches:{
                options:[/^[a-zA-Z0-9-,]+(\s{0,1}[a-zA-Z0-9-, ])*$/],
                errorMessage:'Invalid Concept name '
            },
            // isAlpha : {
            //     errorMessage: 'Invalid Concept Name' // Error message for the parameter
            // },
            errorMessage: 'Concept Name Required'
        }

    },
    "params": {
        'usr_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid user Id' // Error message for the parameter
            },
            errorMessage: 'user Id Required'
        },
    }
};

exports.createTestVldt = {
    
    "body":{
        'tstData' : {
            'ctgry_id': {
                notEmpty: true,
                isInt : {
                    errorMessage: 'Invalid Category Id' // Error message for the parameter
                },
                errorMessage: 'Category Id Required'
            },
            'sub_ctgry_id': {
                notEmpty: true,
                isInt : {
                    errorMessage: 'Invalid Sub Category Id' // Error message for the parameter
                },
                errorMessage: 'Sub Category Id Required'
            },
            'ex_ctgry_id': {
                notEmpty: true,
                isInt : {
                    errorMessage: 'Invalid Exam Category Id' // Error message for the parameter
                },
                errorMessage: 'Exam Category Id Required'
            },
            'tst_nm': {
                notEmpty: true,
                isAlpha : {
                    errorMessage: 'Invalid Test Name' // Error message for the parameter
                },
                errorMessage: 'Test Name Required'
            },
            'tst_cst': {
                notEmpty: true,
                // isFloat : {
                //     errorMessage: 'Invalid Exam Category Id' // Error message for the parameter
                // },
                errorMessage: 'Test Cost is Required'
            },

            'tst_tot_qstn': {
                notEmpty: true,
                isInt : {
                    errorMessage: 'Invalid Total Questions' // Error message for the parameter
                },
                errorMessage: 'Total Questios Required'
            },
            'tst_tot_mrks': {
                notEmpty: true,
                isInt : {
                    errorMessage: 'Invalid Total Marks' // Error message for the parameter
                },
                errorMessage: 'Total Marks Required'
            },
            'tst_tot_tm': {
                notEmpty: true,
                errorMessage: 'Total Time Required'
            },
        },
        'SelSecn' : {

            'tst_id': {
                notEmpty: true,
                isInt : {
                    errorMessage: 'Invalid Test Id' // Error message for the parameter
                },
                errorMessage: 'Test Id Required'
            },
            'tst_stng_tm': {
                notEmpty: true,
                isAlpha : {
                    errorMessage: 'Invalid Time Name' // Error message for the parameter
                },
                errorMessage: 'Test Time Required'
            },
            'secn_id': {
                notEmpty: true,
                isAlpha : {
                    errorMessage: 'Invalid Section Id' // Error message for the parameter
                },
                errorMessage: 'Section Id Required'
            },
            'tst_stng_post_mrk': {
                notEmpty: true,
                errorMessage: 'Positive Mark Required'
            }
        },
        'conceptData' : {

            'secn_id': {
                notEmpty: true,
                isInt : {
                    errorMessage: 'Invalid Section Id' // Error message for the parameter
                },
                errorMessage: 'Section Id Required'
            },
            'concpt_id': {
                notEmpty: true,
                isInt : {
                    errorMessage: 'Invalid concept Id' // Error message for the parameter
                },
                errorMessage: 'concept Id Required'
            },
            'qstn_cnt': {
                notEmpty: true,
                isInt : {
                    errorMessage: 'Invalid Question Count' // Error message for the parameter
                },
                errorMessage: 'Question Count Required'
            }
        }
    }
};

exports.getConcpt = {
    "params": {
        'secn_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid section Id' // Error message for the parameter
            },
            errorMessage: 'section Id Required'
        },
    },
};

exports.getTestsVldt = {
    "params" : {
        'clnt_id' : {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Client Id' // Error message for the parameter
            },
            errorMessage: 'Client Id is  Required'
        }
    },
    "body": {
        'ctgry_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Category Id' // Error message for the parameter
            },
            errorMessage: 'Category Id Required'
        },
        'sub_ctgry_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Sub Category Id' // Error message for the parameter
            },
            errorMessage: 'Sub Category Id Required'
        },
        'ex_ctgry_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Exam Category Id' // Error message for the parameter
            },
            errorMessage: 'Exam Category Id Required'
        },
    },
    
    
};

exports.delQstnVldt = {
    "body": {
        'qstn_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Question Id' // Error message for the parameter
            },
            errorMessage: 'Question Id Required'
        },
    },
};

exports.getQstnsVldt = {
    "params": {
        'qstn_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Question Id' // Error message for the parameter
            },
            errorMessage: 'Question Id Required'
        },
    },
};
exports.getExCtgryVldt = {
    "params": {
        'sub_ctgry_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid sub category Id' // Error message for the parameter
            },
            errorMessage: 'Sub category Id Required'
        },
    },
};

exports.getTestbyExCtgry = {
    "params": {
        'ex_ctgry_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Exam category Id' // Error message for the parameter
            },
            errorMessage: 'Exam category Id Required'
        },
    },
};

exports.createPckgVldt = {
    "body": {
        'pckg_dtls' : {
            'ex_ctgry_id': {
                notEmpty: true,
                isInt : {
                    errorMessage: 'Invalid Exam category Id' // Error message for the parameter
                },
                errorMessage: 'Exam category Id Required'
            },
            'pckg_nm': {
                notEmpty: true,
                isInt : {
                    errorMessage: 'Invalid Package Name' // Error message for the parameter
                },
                errorMessage: 'Package Name Required'
            },
            'pckg_cst': {
                notEmpty: true,
                errorMessage: 'Package Cost Required'
            },
            'pckg_exp_dt': {
                notEmpty: true,
                errorMessage: 'Package Expiry Date Required'
            },
            'user_pckg_dt': {
                notEmpty: true,
                errorMessage: 'User Package Expiry Date Required'
            },
            'tst_cnt': {
                notEmpty: true,
                isInt : {
                    errorMessage: 'Invalid Test Count' // Error message for the parameter
                },
                errorMessage: 'Test Count Required'
            }
        },
        'test_dtls' : {
            'tst_id': {
                notEmpty: true,
                isInt : {
                    errorMessage: 'Invalid Test Id' // Error message for the parameter
                },
                errorMessage: 'Test Id Required'
            }
        },
        'img1' : {
            notEmpty: true,
            errorMessage: 'Web Image Required'
        },
        'img2' : {
            notEmpty: true,
            errorMessage: 'Mobile Image Required'
        }
    },
};

exports.updVldtVldt = {
    "body": {
        'qstn_data' : {
            'Question': {
                notEmpty: true,
                errorMessage: 'Question Required'
            },
            'QuestType': {
                notEmpty: true,
                isInt:{
                    errorMessage: 'Invalid Question Type' // Error message for the parameter
                },
                errorMessage: 'Question Type Required'
            },
            'Level': {
                notEmpty: true,
                isAlpha: {
                    errorMessage: 'Invalid Level' // Error message for the parameter
                },
                errorMessage: 'Level Required'
            },
            'Option1': {
                notEmpty: true,
                isAlpha:{
                    errorMessage: 'Invalid Option 1' // Error message for the parameter
                },
                errorMessage: 'Option 1 Required'
            },
            'Option2': {
                notEmpty: true,
                isAlpha: {
                    errorMessage: 'Invalid Option 2' // Error message for the parameter
                },
                errorMessage: 'Option 2 Required'
            },
            'Option3': {
                notEmpty: true,
                isAlpha: {
                    errorMessage: 'Invalid Option 3' // Error message for the parameter
                },
                errorMessage: 'Option 3 Required'
            },
            'Option4': {
                notEmpty: true,
                isAlpha: {
                    errorMessage: 'Invalid Option 4' // Error message for the parameter
                },
                errorMessage: 'Option 4 Required'
            },
            'CorrectOption': {
                notEmpty: true,
                isInt: {
                    errorMessage: 'Invalid Correct Option' // Error message for the parameter
                },
                errorMessage: 'Correct Option Required'
            }
        },
        'updQstn' : {
            'instruction': {
                notEmpty: true,
                isAlpha: {
                    errorMessage: 'Invalid Instruction' // Error message for the parameter
                },
                errorMessage: 'Instruction Required'
            },
            'instr_id': {
                notEmpty: true,
                isInt: {
                    errorMessage: 'Invalid Instruction Id' // Error message for the parameter
                },
                errorMessage: 'Instruction Id Required'
            }
        }
    },
};

exports.excelUploadVldt = {
    "body": {
        'data' : {
            'ConceptName' : {
                notEmpty: true,
                isAlpha: {
                    errorMessage: 'Invalid Concept Name' // Error message for the parameter
                },
                errorMessage: 'Concept Name Required'
            },
            'instruction': {
                notEmpty: true,
                isAlpha: {
                    errorMessage: 'Invalid Instruction' // Error message for the parameter
                },
                errorMessage: 'Instruction Required'
            },

            'Question': {
                notEmpty: true,
                errorMessage: 'Question Required'
            },
            'QuestType': {
                notEmpty: true,
                isInt:{
                    errorMessage: 'Invalid Question Type' // Error message for the parameter
                },
                errorMessage: 'Question Type Required'
            },
            'Level': {
                notEmpty: true,
                isAlpha: {
                    errorMessage: 'Invalid Level' // Error message for the parameter
                },
                errorMessage: 'Level Required'
            },
            'Option1': {
                notEmpty: true,
                isAlpha:{
                    errorMessage: 'Invalid Option 1' // Error message for the parameter
                },
                errorMessage: 'Option 1 Required'
            },
            'Option2': {
                notEmpty: true,
                isAlpha: {
                    errorMessage: 'Invalid Option 2' // Error message for the parameter
                },
                errorMessage: 'Option 2 Required'
            },
            'Option3': {
                notEmpty: true,
                isAlpha: {
                    errorMessage: 'Invalid Option 3' // Error message for the parameter
                },
                errorMessage: 'Option 3 Required'
            },
            'Option4': {
                notEmpty: true,
                isAlpha: {
                    errorMessage: 'Invalid Option 4' // Error message for the parameter
                },
                errorMessage: 'Option 4 Required'
            },
            'CorrectOption': {
                notEmpty: true,
                isInt: {
                    errorMessage: 'Invalid Correct Option' // Error message for the parameter
                },
                errorMessage: 'Correct Option Required'
            }
        },
        'sectionid' : {
            notEmpty: true,
            isInt: {
                errorMessage: 'Invalid section Id' // Error message for the parameter
            },
            errorMessage: 'section Id Required'
        }
    },
};

exports.getPckgVldt = {
    "params": {
        'usr_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid user Id' // Error message for the parameter
            },
            errorMessage: 'user Id Required'
        },
    },
};

exports.updSecnVldt = {
    "params": {
        'secn_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Section Id' // Error message for the parameter
            },
            errorMessage: 'Section Id Required'
        },
        'secn_nm' : {
            notEmpty: true,
            isAlpha : {
                errorMessage: 'Invalid Section Name' // Error message for the parameter
            },
            errorMessage: 'Section Name Required'
        }
    },
};

exports.getExCtgryVldt = {
    "params": {
        'sub_ctgry_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Sub Category Id' // Error message for the parameter
            },
            errorMessage: 'Sub Category Id Required'
        },
    }
};


// exports.updateAssertsVld = {
//     "params": {
//         'asrtId': {
//             notEmpty: true,
//             isInt : {
//                 errorMessage: 'Invalid asrt Id' // Error message for the parameter
//             },
//             errorMessage: 'asrt Id Required'
//         },
//     },
// };


exports.getStdVldt = {
    "body": {
        'ph_num': {
            notEmpty: true,
            errorMessage: 'Phone Number is  Required'
        },
        'pswrd' : {
            notEmpty: true,
            errorMessage: 'Password Must'
        }
    },
    "params" : {
        'clnt_id' : {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Client Id' // Error message for the parameter
            },
            errorMessage: 'Client Id is  Required'
        }
    }
};


exports.getprofileDtl = {
    "params": {
        'usr_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid user Id' // Error message for the parameter
            },
            errorMessage: 'user Id Required'
        },
    },
};

exports.getSectDtl = {
    "params": {
        'section': {
            notEmpty: true,
            errorMessage: 'Section is requied Required'
        },
    },
};
exports.sbCtgry = {
    "params": {
        'ctgry': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Subcategeory' // Error message for the parameter
            },
            errorMessage: 'Subcategeory is  Required'
        },
    },
};


exports.getsecDtls = {
    "params": {
        'gtTstlst': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Sub categeory' // Error message for the parameter
            },
            errorMessage: 'Sub categeory is  Required'
        },
    },
};

exports.EditCategory = {

    "params": {
      'main_id': {
           notEmpty: true,
           isInt : {
            errorMessage: 'Invalid Category Id' // Error message for the parameter
           },
           errorMessage: 'Category Id is Required'
       }, 
    'select_id': {
        notEmpty: true,
        isInt : {
            errorMessage: 'Invalid Category Id' // Error message for the parameter
        },
        errorMessage: 'Category Id is Required'
    }
    }
};

exports.EditctgryPost = {
    "body": {
        
      'ctgry_nm': {
           notEmpty: true,
           isAlpha : {
            errorMessage: 'Invalid Category Name' // Error message for the parameter
           },
           errorMessage: 'category Name is Required'
       }
    }
};

exports.DeleteTest = {
    
    // "body": {
    //     'tst_id': {
    //          notEmpty: true,
    //          isAlpha : {
    //           errorMessage: 'Invalid Category Name' // Error message for the parameter
    //          },
    //          errorMessage: 'category Name is Required'
    //      }
    //   },
    "params": {
        'usr_id': { 
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid user Id' // Error message for the parameter
            },
            errorMessage: 'user Id Required'
        },
        'tst_id': {
            notEmpty: true,
            isAlpha : {
             errorMessage: 'Invalid Category Name' // Error message for the parameter
            },
            errorMessage: 'category Name is Required'
        }
    },
    
};

exports.DeletePackage = {
    "params": {
        'pckg_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Section Id' // Error message for the parameter
            },
            errorMessage: 'Section Id Required'
        }
    },
};

exports.EditConcept = {
    "params": {
        'concpt_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Section Id' // Error message for the parameter
            },
            errorMessage: 'Section Id Required'
        },
        'concpt_nm' : {
            notEmpty: true,
            isAlpha : {
                errorMessage: 'Invalid Section Name' // Error message for the parameter
            },
            errorMessage: 'Section Name Required'
        }
    },
};

exports.testViewVldt = {
    "params": {
        'clnt_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid user Id' // Error message for the parameter
            },
            errorMessage: 'user Id Required'
        },
        'tst_id' : {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid user Id' // Error message for the parameter
            },
            errorMessage: 'user Id Required'
        }
    },
};


// prcharseCtrl
exports.prcharseCtrl = {
    "params": {
        'usr_id': { 
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid user Id' // Error message for the parameter
            },
            errorMessage: 'user Id Required'
        }
       
    },
};
exports.getTstbyActvPckId = {
    "params": {
        'Actv_pkg_id' : {
            notEmpty: true,
            errorMessage: 'Actv_pkg_id Required'
        }
    },
};
exports.deleteCrtDtl = {
    
    "params": {
        'usr_id': { 
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid user Id' // Error message for the parameter
            },
            errorMessage: 'user Id Required'
        },
        'pckg_id' : {
            notEmpty: true,
            isInt: {
                errorMessage: 'Invalid package Id' // Error message for the parameter
            },
            errorMessage: 'package Id Required'
        },
        'dtl' : {
            notEmpty: true,
            isInt: {
                errorMessage: 'Invalid cart Id' // Error message for the parameter
            },
            errorMessage: 'cart Id Required'
        }
    },
};

exports.getsummaryChk = {
    "body": {
        'tst_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid test Id' // Error message for the parameter
            },
            errorMessage: 'test Id Required'
        },
        'usr_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid userid' // Error message for the parameter
            },
            errorMessage: 'user Id Required'
        },
        'Actv_pck_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid Actv_pck_id' // Error message for the parameter
            },
            errorMessage: 'Actv_pck_id Id Required'
        },
    },
};


exports.gettest = {
    "params": {
        'usr_id': { 
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid user Id' // Error message for the parameter
            },
            errorMessage: 'user Id Required'
        },
        'Actv_pck_id' : {
            notEmpty: true,
            isInt: {
                errorMessage: 'Invalid Actv_pck_id' // Error message for the parameter
            },
            errorMessage: 'Actv_pck_id Required'
        },
        'tst_id' : {
            notEmpty: true,
            isInt: {
                errorMessage: 'Invalid tst_id' // Error message for the parameter
            },
            errorMessage: 'tst_id Required'
        },
        'from_ind' : {
            notEmpty: true,
            isInt: {
                errorMessage: 'Invalid index' // Error message for the parameter
            },
            errorMessage: 'index Required'
        },
        'to_ind' : {
            notEmpty: true,
            isInt: {
                errorMessage: 'Invalid nxtindex' // Error message for the parameter
            },
            errorMessage: 'nxtindex Required'
        }
    },
};
exports.sumbtform = {
    "body": {
        'name': {
            notEmpty: true,
            errorMessage: 'Name is Required'
        },
        'email' : {
            notEmpty: true,
            errorMessage: 'Email is required'
        },
        'subject' : {
            notEmpty: true,
            errorMessage: 'subject'
        },
        'msg' : {
            notEmpty: true,
            errorMessage: 'Password Must'
        }
    },

};



exports.getqntbyid = {
    "params": {
        'usr_id': { 
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid user Id' // Error message for the parameter
            },
            errorMessage: 'user Id Required'
        },
        'Actv_pck_id' : {
            notEmpty: true,
            isInt: {
                errorMessage: 'Invalid Actv_pck_id' // Error message for the parameter
            },
            errorMessage: 'Actv_pck_id Required'
        },
        'tst_id' : {
            notEmpty: true,
            isInt: {
                errorMessage: 'Invalid tst_id' // Error message for the parameter
            },
            errorMessage: 'tst_id Required'
        },
        // 'secn_id' : {
        //     notEmpty: true,
        //     isInt: {
        //         errorMessage: 'Invalid secn_id' // Error message for the parameter
        //     },
        //     errorMessage: 'secn_id Required'
        // },
      
    },
};





exports.getQstns = {
    "params": {
        'usr_id': { 
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid user Id' // Error message for the parameter
            },
            errorMessage: 'user Id Required'
        },
        'Actv_pck_id' : {
            notEmpty: true,
            isInt: {
                errorMessage: 'Invalid Actv_pck_id' // Error message for the parameter
            },
            errorMessage: 'Actv_pck_id Required'
        },
        'tst_id' : {
            notEmpty: true,
            isInt: {
                errorMessage: 'Invalid tst_id' // Error message for the parameter
            },
            errorMessage: 'tst_id Required'
        },
        'tarQstn' : {
            notEmpty: true,
            errorMessage: 'tarQstn Required'
        },
        'opt' : {
            notEmpty: true,
            isInt: {
                errorMessage: 'Invalid opt' // Error message for the parameter
            },
            errorMessage: 'opt Required'
        },
        'usr_qstn_id' : {
            notEmpty: true,
            isInt: {
                errorMessage: 'Invalid usr_qstn_id' // Error message for the parameter
            },
            errorMessage: 'usr_qstn_id Required'
        },
    },
};



exports.signupVldt = {
    "params": {
        'aid': { 
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid aid' // Error message for the parameter
            },
            errorMessage: 'aid Required'
        },
        'clnt_id': { 
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid clnt_id' // Error message for the parameter
            },
            errorMessage: 'clnt_id Required'
        },
    },
    "body": {
        'ph_num': {
            notEmpty: true,
            errorMessage: 'Phone Number is Required'
        },
        'pswrd' : {
            notEmpty: true,
            errorMessage: 'Password is required'
        },
        'fnm' : {
            notEmpty: true,
            errorMessage: 'fnm is required'
        },
        'lnm' : {
            notEmpty: true,
            errorMessage: 'lnm Must'
        },
        'qlfcn': { 
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid qlfcn' // Error message for the parameter
            },
            errorMessage: 'qlfcn Required'
        },
        'email' : {
            notEmpty: true,
            errorMessage: 'email Must'
        },
        // 'lat' : {
        //     notEmpty: true,
        //     errorMessage: 'latitude Must'
        // },
        // 'lng' : {
        //     notEmpty: true,
        //     errorMessage: 'longitude Must'
        // },

    },
};



exports.getPckgsByUserVldt = {
    "params": {
       
    },
        "body": {
        //    'ctgry': { 
        //     notEmpty: true,
        //     isInt : {
        //         errorMessage: 'categeory is Invalid' // Error message for the parameter
        //     },
        //     errorMessage: 'categeory is Required'
        // },
        'usr_id': { 
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid user Id' // Error message for the parameter
            },
            errorMessage: 'user Id Required'
        },
    
     }, 
};




exports.updtProfile = {
    "body": {
        'ph_num': {
            notEmpty: true,
            errorMessage: 'Phone Number is Required'
        },
        'fnm' : {
            notEmpty: true,
            errorMessage: 'fnm is required'
        },
        'lnm' : {
            notEmpty: true,
            errorMessage: 'lnm Must'
        },
        'qlfcn': { 
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid qlfcn' // Error message for the parameter
            },
            errorMessage: 'qlfcn Required'
        },
        'email' : {
            notEmpty: true,
            errorMessage: 'email Must'
        },
    },

};

exports.institute_getStdVldt = {
    "body": {
        'ph_num': {
            notEmpty: true,
            errorMessage: 'Phone Number is  Required'
        },
        'pswrd' : {
            notEmpty: true,
            errorMessage: 'Password Must'
        }
    },
    "params": {
        'clnt_id': {
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid user Id' // Error message for the parameter
            },
            errorMessage: 'user Id Required'
        },
    },
};

exports.institute_signupVldt = {
    "params": {
        'aid': { 
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid aid' // Error message for the parameter
            },
            errorMessage: 'aid Required'
        },
        'clnt_id': { 
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid clnt_id' // Error message for the parameter
            },
            errorMessage: 'clnt_id Required'
        },
    },
    "body": {
        'ph_num': {
            notEmpty: true,
            errorMessage: 'Phone Number is Required'
        },
        'pswrd' : {
            notEmpty: true,
            errorMessage: 'Password is required'
        },
        'fnm' : {
            notEmpty: true,
            errorMessage: 'fnm is required'
        },
        'lnm' : {
            notEmpty: true,
            errorMessage: 'lnm Must'
        },
        'qlfcn': { 
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid qlfcn' // Error message for the parameter
            },
            errorMessage: 'qlfcn Required'
        },
        'email' : {
            notEmpty: true,
            errorMessage: 'email Must'
        },
    },
};

exports.institute_getPckgsByUserVldt = {
    "params": {
        'usr_id': { 
            notEmpty: true,
            isInt : {
                errorMessage: 'Invalid user Id' // Error message for the parameter
            },
            errorMessage: 'user Id Required'
        },
    },
        "body": {
        //    'ctgry': { 
        //     notEmpty: true,
        //     isInt : {
        //         errorMessage: 'categeory is Invalid' // Error message for the parameter
        //     },
        //     errorMessage: 'categeory is Required'
        // },
        
    
     }, 
};