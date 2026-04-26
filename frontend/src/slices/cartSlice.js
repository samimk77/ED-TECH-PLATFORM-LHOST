import { createSlice } from "@reduxjs/toolkit";
import {toast} from 'react-hot-toast'




const initialState={
    cart:localStorage.getItem("cart")? JSON.parse(localStorage.getItem("cart")):[], //initial cart state is empty list of courses

    totalItems:localStorage.getItem("totalItems") ? JSON.parse(localStorage.getItem("totalItems")):0, //total number of items in cart

    total:localStorage.getItem("total")?JSON.parse(localStorage.getItem("total")):0  //total amount of cart
}

export const cartSlice=createSlice({
    name:"cart",
    initialState:initialState,
    reducers:{
        setTotalItems:(state,action)=>{
            state.totalItems=action.payload
        },

        addToCart:(state,action)=>{
            const course=action.payload
            const index=state.cart.findIndex((item)=>item._id === course._id)

            if(index >=0){
                //if course is already there in cart then do not modify the quantity
                toast.error("Course already in cart")
                return
            }
            //if course is not in cart then push in cart
            state.cart.push(course)

            //update the total quantity
            state.totalItems++

            //update the totall price
            state.total+=course.price;

            //update to localstore
            localStorage.setItem("cart",JSON.stringify(state.cart))
            localStorage.setItem("total",JSON.stringify(state.total))
            localStorage.setItem("totalItems",JSON.stringify(state.totalItems))

            toast.success("Course added to cart")


        },

        removeFromCart:(state,action)=>{
                const courseId=action.payload

                //find the course
                const index=state.cart.findIndex((item)=>item._id===courseId)

                if(index<0){
                    toast.error("Course not found in cart");
                    return;
                }

                const course=state.cart[index];

                //remove from cart
                state.cart.splice(index,1);

                //update total items
                state.totalItems--;

                //update total price
                state.total-=course.price;

                //update localstorage
                  localStorage.setItem("cart", JSON.stringify(state.cart));
                  localStorage.setItem("total", JSON.stringify(state.total));
                  localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

                  toast.success("Course removed from cart");
        },
        resetCart :(state)=>{
            state.cart=[];
            state.total=0;
            state.totalItems=0;
            localStorage.removeItem("cart"),
            localStorage.removeItem("total"),
            localStorage.removeItem("totalItems");

        }
    }

    
    
    //reset cart

})

export const {setTotalItems,addToCart,removeFromCart,resetCart} =cartSlice.actions
export default cartSlice.reducer