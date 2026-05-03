import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/components/header'
import CartItem from '@/components/cartItem'

export default function Cart() {

  const {cartItems, cartTotal, removeFromCart, updateQuantity}= useCart()

  const router = useRouter()

  const shippingAmount = 5.00;
  const total = cartTotal + shippingAmount;
  return (
    <SafeAreaView>
      <Header title='My Cart' showBack/>

      {cartItems.length > 0 ? (
        <>
        <ScrollView className='flex-1 px-4 mt-4' showsVerticalScrollIndicator={false}>
          {cartItems.map((item, index)=> (
            <CartItem key={index} item={item} onRemove={()=> removeFromCart(item.id, item.size)} onUpdateQuantity={(q)=> updateQuantity(item.id, q, item.size)}/>
          ))}
        </ScrollView>

        <View className='p-4 bg-white rounded-t-3xl shadow-sm'>

          {/*subtotal */}
          <View className='flex-row justify-between mb-2'>
            <Text className='text-secondry'>Subtotal</Text>
            <Text className='text-primary font-bold'>{cartTotal.toFixed(2)}</Text>
          </View>

          {/*shipping details */}
          <View className='flex-row justify-between mb-2'>
            <Text className='text-secondry'>Shipping</Text>
            <Text className='text-primary font-bold'>{shippingAmount.toFixed(2)}</Text>
          </View>

          {/*border */}
          <View className='h-[1px] bg-border mb-4' />

          {/* total amount*/}
          <View className='flex-row justify-between mb-6'>
            <Text className='text-primary font-bold text-lg'>Total</Text>
            <Text className='text-primary font-bold text-lg'>{total.toFixed(2)}</Text>
          </View>

          {/*checkout button*/}
          <TouchableOpacity className='bg-primary py-4 rounded-full items-center' onPress={()=> router.push('/checkout')}>
            <Text className='text-white font-bold text-base'>Chechout</Text>
          </TouchableOpacity>


        </View>
        </>
      ) : (
        <View className='flex-1 items-center justify-center'>
          <Text className='text-secondry text-lg'>Your Cart is Empty.</Text>
          <TouchableOpacity onPress={()=> router.push('/shop')} className='mt-4'>
            <Text className='text-primary font-bold'>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}