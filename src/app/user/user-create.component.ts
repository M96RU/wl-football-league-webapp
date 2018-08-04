import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SeasonService} from '../model/season';
import {User, UserService} from '../model/user';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'user-create',
  templateUrl: './user-create.component.html'
})
export class UserCreateComponent implements OnInit {


  @Output()
  userCreate = new EventEmitter();

  public userCreateForm: FormGroup;

  constructor(public seasonService: SeasonService, public fb: FormBuilder, private userService: UserService) {
    this.userCreateForm = fb.group({
      'das': [null, Validators.compose([Validators.required, Validators.minLength(5)])],
      'firstname': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'lastname': [null, Validators.compose([Validators.required, Validators.minLength(2)])],
      'email': [null, Validators.compose([Validators.required, Validators.email])]
    });
  }

  ngOnInit() {
  }

  doCreateUser(value: any) {


    const user = new User();
    user.das = this.userCreateForm.value.das;
    user.firstname = this.userCreateForm.value.firstname;
    user.lastname = this.userCreateForm.value.lastname;
    user.email = this.userCreateForm.value.email;
    this.userService.create(user).subscribe(createUser => {
      this.userCreate.emit(createUser);
      this.userCreateForm.reset();
    });
  }


}
