const inputslider= document.querySelector(" [data-lengthSlider]");
const lengthdisplay=document.querySelector("[data-lengthnumber]");
const passworddisplay=document.querySelector("[data-passwordgenerator]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMsg]");
const uppercasecheck=document.querySelector("#uppercase");
const lowercasecheck=document.querySelector("#lowercase");
const numbercheck=document.querySelector("#number");
const symbolscheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generatorBtn=document.querySelector(".generatebutton");
const allcheckbox=document.querySelectorAll("input[type=checkbox]");
const symbols= '~`!@#$%^&*()_-+={[}]:;"<,>.?/';
let password=" ";
let plength=10;
let checkcount=0;
handleslider();
// set strength of circle grey
setIndicator("#ccc");
// passwaord lenght
function handleslider() {
    inputslider.value = plength;
    lengthdisplay.innerText= plength;
    const min=inputslider.min;
    const max=inputslider.max;
    inputslider.style.backgroundSize=((plength-min)*100/(max-min))+"% 100%"
}
function setIndicator(color){
    indicator.style.backgroundColor= color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getInteger(min,max){
   return Math.floor(Math.random()*( max-min)) + min;
}
function generateRandomnumber() {
    return getInteger(0,9);
}

function generatelowercase(){
     return String.fromCharCode(getInteger(97,123));
}
function generateuppercase(){
     return String.fromCharCode(getInteger(65,91));
}
function generatesymbol(){
    const randnum= getInteger(0,symbols.length);
    return symbols.charAt(randnum);
}

function calcstrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercasecheck.checked) hasUpper=true;
    if(lowercasecheck.checked) hasLower=true;
    if(numbercheck.checked) hasNum=true;
    if(symbolscheck.checked) hasSym=true;
if(hasUpper&& hasLower&& (hasNum|| hasSym)&& plength>=8){
    setIndicator("#0f0");
}else if(
    (hasLower || hasUpper)&&
    (hasNum || hasSym)&&
    plength>=6
){
    setIndicator("#ff0");
}else {
    setIndicator("#f00");
}

}


    
async function copycontent(){
    try{
        await navigator.clipboard.writeText(passworddisplay.value);
        copyMsg.innerText= "copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    copyMsg.classList.add("active");
setTimeout(()=> {
    copyMsg.classList.remove("active");} , 2000);
}

inputslider.addEventListener('input',(e)=> {
plength=e.target.value;
handleslider();
})
copyBtn.addEventListener('click', ()=>{
    if(passworddisplay.value)
    copycontent();
})
function shufflepassword(array){
    // fisher yates method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp =array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;

}
function handlecheckboxchange(){
    checkcount=0;
    allcheckbox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkcount++;
    });
    // special condition 
    if(plength<checkcount){
        plength=checkcount;
        handleslider();
    }
}
allcheckbox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handlecheckboxchange);
})

generatorBtn.addEventListener('click',()=>{
    // non of the check box  are selected
    if(checkcount<=0) return;
    if(plength<checkcount){
        plength=checkcount;
        handleslider();
    } 
    // let start the journey to find new password
    // removeed old password
    password="";
    // let put the stuff mentioned by checkbox
    // if(uppercasecheck.checked){
    //     password+=generateuppercase();
    // }
    // if(lowercasecheck.checked){
    //     password+=generatelowercase;
    // }
    // if(numbercheck.checked){
    //     password+=generateRandomnumber();
    // }
    // if(symbolscheck.checked){
    //     password+=generatesymbol();
    // }
    let funcArr=[];
    if(uppercasecheck.checked)
    funcArr.push(generateuppercase);



   if(lowercasecheck.checked)
     funcArr.push(generatelowercase);

    if(numbercheck.checked)
         funcArr.push(generateRandomnumber);

    if(symbolscheck.checked)
        funcArr.push(generatesymbol);


        // compulsory addintion
        for(let i=0;i<funcArr.length;i++){
            password+=funcArr[i]();
        }
        // remaining addition
        for(let i=0;i<plength-funcArr.length;i++){
            let randindex=getInteger(0, funcArr.length);
            password+=funcArr[randindex]();
        }
        // shuffle the password
        password=shufflepassword(Array.from(password));
        // shoe in ui
        passworddisplay.value=password;
        // calculate strength
        calcstrength();
})
