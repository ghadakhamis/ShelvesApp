import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  Book,
  BookService,
  User,
  UserService
} from '../../shared';


@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss']
})
export class ShowComponent implements OnInit {
  val: number;
  book: Book;
  currentUser: User;
  canModify: boolean;
  similarBooks: Array<Book>;
  orderForm: FormGroup;
  orderSellForm: FormGroup;
  error: string;
  message: string;
  orderFormErrors = {};
  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router,
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.error = "";
    this.message= "";
    this.similarBooks = [];
    this.getBook();
    this.getSimilarBooks(); 
    this.orderForm = this.fb.group({
      'price': ['', [Validators.required]]
    });
    this.orderSellForm = this.fb.group({
      'quantity': ['', [Validators.required]]
    });
  }

  // get book data
  getBook() {
      // get book id from url
    const book_id = parseInt(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBook(book_id).subscribe(
      result => {
        this.book = result['book'];
        console.log(this.book)
        // Load the current user's data
        this.userService.currentUser.subscribe(
          (userData: User) => {
            this.currentUser = userData;
            this.canModify = (this.currentUser.id === this.book.user[0].id);
          }
        );
      },
      error => {
        console.log(error);
       }
    );   
  }

  getSimilarBooks() {
  }

//order book for sell by bids
  updateBidPrice(){
    let price = this.orderForm.value.price;
    this.bookService
    .updateBidForBook(this.book.id,price)
    .subscribe(
      result => {
        console.log(result);
        if( result['status'] == 'FAIL' ) {
          this.error = result['message']
        }
        else {
          if( result['message'] ) {
            this.message = result['message']
           
          }
         
        }
    },
      error => {
        alert("Couldn\'t make Bid on this Book")
        this.router.navigateByUrl('/');
         console.log(error);
      }
    );
  }

  //order book for Sell 
   
  orderBookForSell(){
    let quantity = this.orderSellForm.value.quantity;
    this.bookService
    .orderToSellBook(this.book.id,quantity)
    .subscribe(
      result => {
        console.log(result);
        if( result['status'] == 'FAIL' ) {
          this.error = result['message']
        }
        else {
          if( result['message'] ) {
            this.message = result['message']
           
          }
         
        }
    },
      error => {
        alert("Couldn\'t make Bid on this Book")
        this.router.navigateByUrl('/');
         console.log(error);
      }
    );
  }

  
  // submit order form
  submitOrder() {
    console.log(this.book.transcation);
    if (this.book.transcation == "Sell By Bids")
    {
      this.updateBidPrice();
    }else if (this.book.transcation == "Sell")
    {
      this.orderBookForSell();
    }  
        
  }

  reload(){
    location.reload()
  }
 
}
