<template>
  <div>
    <p>以下email地址已关联到您的账号：</p>
    <ul class="email-list">
      <li v-for="item in emailList" :key="item.email">
        <input type="radio" name="radio" :id="item.id" :value="item.id" v-model="picked">
        <span class="email-text">{{item.email}}</span>
        <span v-if="item.verified === true" class="badge badge-success">已验证</span>
        <span v-else class="badge badge-danger">未验证</span>
        <span v-if="item.primary === true" class="badge badge-primary">首选</span>
      </li>
      <div class="button-group">
        <nav aria-label="Page navigation example">
          <ul class="pagination">
            <li v-if="lastPage > 1" :class="['page-item', { disabled: currentPage === 1 }]">
              <span class="page-link" @click="getPrePageEmails" tabindex="-1">
                上一页
              </span>
            </li>
            <li v-if="lastPage > 1" :class="['page-item', { disabled: currentPage === lastPage }]">
              <span class="page-link" @click="getNextPageEmails" tabindex="-1">
                下一页
              </span>
            </li>
            <button @click.prevent="showVerifyDialog" type="submit" class="btn btn-primary">验证选中的邮箱</button>
            <button @click.prevent="showPrimaryDialog" type="submit" class="btn btn-primary">设置主邮箱</button>
            <button @click.prevent="showDeleteDialog" type="submit" class="btn btn-danger">删除邮箱</button>
          </ul>
        </nav>
      </div>
    </ul>
    <h1 class="title">添加Email</h1>
    <form>
      <div class="form-group">
        <label for="newEmail">Email</label>
        <input v-model="newEmail" type="email" class="form-control" id="newEmail" placeholder="请输入新的邮箱地址">
      </div>
      <!--<div class="form-group">-->
        <!--<label for="verificationCode">验证码</label>-->
        <!--<input v-model="verificationCode" type="text" class="form-control" id="verificationCode" placeholder="请输入右侧验证码">-->
      <!--</div>-->
      <button @click.prevent="handleAddEmail" type="submit" class="btn btn-primary">保存</button>
    </form>
    <div class="dialog-wrapper">
      <Dialog title="提示信息" :visible.sync="dialogVisible">
        <form>
          <span>{{ dialogMessage }}</span>
        </form>
        <span slot="footer">
          <div v-if="dialogType==='show'">
            <button type="button" class="btn btn-primary" @click.prevent="dialogVisible = false">确定</button>
          </div>
          <div v-if="dialogType==='confirm'">
            <button type="button" class="btn btn-secondary" @click.prevent="dialogVisible = false">取消</button>
            <button type="button" class="btn btn-danger" @click.prevent="handleDeleteEmail">确定</button>
          </div>
          <div v-if="dialogType==='confirmPrimary'">
            <button type="button" class="btn btn-secondary" @click.prevent="dialogVisible = false">取消</button>
            <button type="button" class="btn btn-danger" @click.prevent="handleSetPrimaryEmail">确定</button>
          </div>
          <div v-if="dialogType==='confirmVerify'">
            <button type="button" class="btn btn-secondary" @click.prevent="dialogVisible = false">取消</button>
            <button type="button" class="btn btn-danger" @click.prevent="handleVerifyEmail">确定</button>
          </div>
        </span>
      </Dialog>
    </div>
  </div>
</template>
<script>
import { getEmailList, addEmail, setPrimaryEmail, deleteEmail, reverifyEmail } from '@/api'
import Dialog from '@/components/Dialog'

export default {
  name: 'EmailSet',
  data () {
    return {
      emailList: [],
      currentPage: 1,
      lastPage: 1,
      targetPage: 1,
      newEmail: '',
      verificationCode: '',
      userId: '',
      picked: '',
      dialogVisible: false,
      dialogMessage: '',
      dialogType: 'show'
    }
  },
  mounted: function () {
    this.userId = localStorage.getItem('userId')
    // console.log(this.userId)
    this.getEmails()
  },
  methods: {
    getEmails () {
      let params = {
        // page_size: 1,
        page: this.targetPage
      }
      getEmailList(params).then(res => {
        this.currentPage = res.data.current_page
        this.lastPage = res.data.last_page
        this.emailList = res.data.data
        // console.log(res.data)
      })
    },
    handleAddEmail () {
      if (this.newEmail.length === 0) {
        this.dialogMessage = '新邮箱不能为空'
        this.dialogVisible = !this.dialogVisible
        this.newEmail = ''
        return
      }
      let reg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$')
      if (!reg.test(this.newEmail)) {
        this.dialogMessage = '新邮箱格式不正确'
        this.dialogVisible = !this.dialogVisible
        this.newEmail = ''
        return
      }
      // TODO 验证码
      let data = {
        'email': this.newEmail
      }
      addEmail(data).then(res => {
        console.log(res.data)
        if (res.status === 201) {
          this.dialogMessage = '新邮箱添加成功'
          this.dialogVisible = !this.dialogVisible
          this.newEmail = ''
          this.getEmails()
        } else {
          this.dialogMessage = '新邮箱添加失败'
          this.dialogVisible = !this.dialogVisible
          this.newEmail = ''
        }
      }).catch((error) => {
        this.dialogMessage = JSON.parse(error.request.response).email[0]
        this.dialogVisible = !this.dialogVisible
        this.newEmail = ''
      })
    },
    showVerifyDialog () {
      this.dialogMessage = '确定验证该邮箱吗？'
      this.dialogType = 'confirmVerify'
      this.dialogVisible = !this.dialogVisible
    },
    handleVerifyEmail () {
      this.dialogVisible = !this.dialogVisible
      if (this.picked.length === 0) {
        alert("未选择任何邮箱！")
        return
      }
      reverifyEmail(this.picked).then(res => {
        alert("验证邮件已发送，请前往验证的邮箱点击激活链接激活")
      }).catch((error) => alert("验证邮件发送失败，请稍后重试。"))
    },
    showPrimaryDialog () {
      this.dialogMessage = '确定设置该邮箱为主邮箱？'
      this.dialogType = 'confirmPrimary'
      this.dialogVisible = !this.dialogVisible
    },
    handleSetPrimaryEmail () {
      this.dialogVisible = !this.dialogVisible
      if (this.picked.length === 0) {
        return
      }
      setPrimaryEmail(this.picked).then(res => {
        for (var item of this.emailList) {
          if (item.id === this.picked) {
            item.primary = true
          } else {
            item.primary = false
          }
        }
      })
    },
    showDeleteDialog () {
      this.dialogMessage = '确定删除该邮箱？'
      this.dialogType = 'confirm'
      this.dialogVisible = !this.dialogVisible
    },
    handleDeleteEmail () {
      this.dialogVisible = !this.dialogVisible
      if (this.picked.length === 0) {
        return
      }
      // console.log(this.picked)
      deleteEmail(this.picked).then(res => {
        if (res.status === 204) {
          this.getEmails()
        }
      })
    },
    getPrePageEmails () {
      this.targetPage = this.currentPage - 1
      this.getEmails()
    },
    getNextPageEmails () {
      this.targetPage = this.currentPage + 1
      this.getEmails()
    }
  },
  components: {
    Dialog
  }
}
</script>
<style scoped>
  .email-list {
    padding: 10px 5px;
    border-bottom: 1px solid #ccc;
  }
  .form-group label {
    margin-bottom: 10px;
  }
  .title {
    height: 30px;
    line-height: 30px;
    font-size: 24px;
    margin-bottom: 10px;
    text-align: center;
  }
  .button-group {
    margin-top: 1rem;
  }
  .btn-primary{
    margin: 0 0.35rem;
  }
  .email-text {
    font-size: 1.2rem;
    line-height: 1;
  }
</style>
