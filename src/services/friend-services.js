// import axios from 'axios';

// const url = 'http://obesecat.atwebpages.com';

// export const findUser = async (username) => {
//     try{
//         const response = await axios.post(`${url}/search-by-username.php`, {params: {username}});
//         return checkResp(response);
//     }
//     catch(e){
//         throw e;
//     }
// }

// export const findNickname = async (nickname) => {
//     try{
//         const response = await axios.post(`${url}/search-by-nickname.php`, {params: {nickname}});
//         return checkResp(response);
//     }
//     catch(e){
//         throw e;
//     }
// }

// export const updateProfileMain = async(accountId, fieldToUpdate, newValue) =>{
//     try{
//         const response = await axios.post(`${url}/profile-customization-services/update-field.php`, 
//             {
//                 id: accountId,
//                 fieldToUpdate: fieldToUpdate,
//                 newValue: newValue,
//             }
//         );
//         return checkResp(response);
//     }catch(e){
//         throw e;
//     }
// }

//  export function checkResp(response){
//     if(response.data.status == 'error'){
//         // console.log('negative response');
//         throw new Error(response.data.message);
//     }else{
//         // console.log('positive response...');
//         // console.log(response.data);
//         return response.data;
//     }
// }