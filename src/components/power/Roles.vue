<template>
    <div>
        <breadcrumb :breadcrumb-item="['用户管理','角色列表']"></breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="4">
                    <el-button type="success" @click="addDialogVisible = true">添加角色</el-button>
                </el-col>
            </el-row>
            <el-table :data="rolesList" style="width: 100%" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for="(item1,i1) in scope.row.children " class="vcenter" :key="i1">
                            <!--一级权限-->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightsById(scope.row,item1.id)">{{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!--2,3级权限-->
                            <el-col :span="19">
                                <el-row v-for="(item2,i2) in item1.children" class="vcenter" :key="i2">
                                    <el-col :span="6">
                                        <el-tag closable type="success" @close="removeRightsById(scope.row,item2.id)">
                                            {{item2.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!--三级-->
                                    <el-col :span="18">
                                        <el-tag v-for="(item3,i3) in item2.children"
                                                :key="i3"
                                                closable type="warning"
                                                @close="removeRightsById(scope.row,item3.id)">{{item3.authName}}
                                        </el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名" prop="roleName"></el-table-column>
                <el-table-column label="描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click=""></el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click=""></el-button>
                        <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button type="warning" icon="el-icon-setting" size="mini"
                                       @click="showSetRightsDialog(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog
                title="分配权限"
                :visible.sync="isShowSetRightsDialog"
                width="50%">
            <span>
                <el-tree :data="rightsList" :props="rightsProps"
                         default-expand-all show-checkbox
                         :default-checked-keys="defkey" node-key="id"
                            ref="treeRef"></el-tree>
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowSetRightsDialog = false">取 消</el-button>
                <el-button type="primary" @click="updateRoleRights">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import Breadcrumb from '../common/Breadcrumb'

    export default {
        name: "Roles",
        components: {
            Breadcrumb
        },
        data() {
            return {
                rolesList: [],
                isShowSetRightsDialog: false,
                rightsList: [],
                rightsProps:{
                    children: 'children',
                    label: 'authName'
                },
                defkey:[],
                roleId:''
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            async getRolesList() {
                let {data: res} = await this.$http.get('roles')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取角色数据失败')
                }
                this.rolesList = res.data
            },

            removeRightsById(role, rightId) {
                // console.log(roleId,rightId);
                this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                    console.log(res);
                    if (res.meta.status !== 200) {
                        return this.$message.error('删除失败！')
                    }

                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    role.children = res.data
                    console.log(role);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },

            //显示分配权限弹框
            async showSetRightsDialog(role) {
                this.roleId = role.id
              let {data:res} = await this.$http.get('rights/tree')
              if(res.meta.status !==200){return this.$message.error('获取权限列表失败')}
              this.rightsList = res.data
              this.isShowSetRightsDialog = true

              //获取选择的权限
                this.defkey =[]
                this.getDefRights(role,this.defkey)
            },
            getDefRights(node,defkey){

                if(!node.children){
                   return defkey.push(node.id)
                }
               node.children.forEach(item => this.getDefRights(item,defkey))
            },

            //分配角色id
            async updateRoleRights(){
                let rights = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]

                rights = rights.join(',')
                let {data:res}= await this.$http.post(`roles/${this.roleId}/rights`,{rids:rights})
               if(res.meta.status !==200){return this.$message.error('更新权限失败')}

               this.$message.success('更新角色权限成功')
                this.getRolesList()
                this.isShowSetRightsDialog = false



            }

        },

    }
</script>

<style lang="less" scoped>
    .el-table {
        margin: 10px 0;
    }

    .el-row {
        /*padding-bottom: 10px;*/
        border-bottom: 1px solid #ccc;
    }

    .el-tag {
        margin: 10px;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>